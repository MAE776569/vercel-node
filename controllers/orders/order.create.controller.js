const { ApiCreateController } = require("../../library/xprevalent")
const { ValidationSchema } = require("../../library/xprevalent/validators")
const orderModel = require("../../models/order.model")
const couponsRepo = require("../../repositories/coupons.repo")
const ordersRepo = require("../../repositories/orders.repo")
const productsRepo = require("../../repositories/products.repo")
const usersRepo = require("../../repositories/users.repo")
const { createOrderSchema } = require("../../validation/orders.schema")
const { events, EVENT_NAMES } = require("../../events/eventEmitter")

class CreateOrderController extends ApiCreateController {
  model = orderModel
  validationSchema = new ValidationSchema(createOrderSchema)

  constructProductsMap(productsInCart) {
    const productsMap = new Map()
    productsInCart.forEach((product) => {
      productsMap.set(product._id, product)
    })
    return productsMap
  }

  validateProductsBeforeOrder({ products, productsMap }) {
    const productsError = {
      outOfStock: [],
      quantityExceeded: [],
    }

    products.forEach(({ _id, name, inStock, quantity }) => {
      const id = _id.toString()
      if (!inStock) {
        productsError.outOfStock.push({
          _id: id,
          name,
          quantity,
        })
      } else if (quantity < productsMap.get(id).quantity) {
        productsError.quantityExceeded.push({
          _id: id,
          name,
          quantity,
        })
      }
    })

    return Boolean(
      productsError.outOfStock.length || productsError.quantityExceeded.length,
    )
      ? productsError
      : null
  }

  constructOrderItems({ products, productsMap }) {
    const orderItems = []
    products.forEach(({ _id, price, priceAfterDiscount, offerId }) => {
      const productInCart = productsMap.get(_id.toString())
      const { quantity, size, color } = productInCart
      orderItems.push({
        product: _id,
        price,
        offer: offerId,
        priceAfterDiscount,
        quantity,
        size,
        color,
      })
    })
    return orderItems
  }

  constructUpdateProductsQuery({ items, session }) {
    const updateQuery = []
    items.forEach(({ product, quantity }) => {
      updateQuery.push(
        productsRepo.updateOneProduct({
          _id: product,
          data: {
            $inc: { quantity: -quantity },
          },
          session,
        }),
      )
    })

    return updateQuery
  }

  clearCart() {
    this.req.session.cart = []
    return new Promise((resolve, reject) => {
      this.req.session.save((err) => {
        if (err) reject(err)
        resolve()
      })
    })
  }

  async handleRequest() {
    try {
      if (
        !(Array.isArray(this.req.session.cart) && this.req.session.cart.length)
      ) {
        return this.sendResponse({
          status: 422,
          message: "Cart is empty",
        })
      }

      const validationResult = this.validationSchema.validate(this.req)
      if (validationResult.hasError()) {
        return this.sendResponse({
          success: false,
          status: 422,
          error: validationResult.getErrors({ location: "body" }),
        })
      }
      const billingDetails = validationResult.getValue("body")

      const productsInCart = this.req.session.cart || []
      if (!productsInCart.length) {
        return this.sendResponse({
          success: false,
          status: 400,
          message: "Cart is empty",
        })
      }

      const productsMap = this.constructProductsMap(productsInCart)
      const productsIds = productsInCart.map(({ _id }) => _id)
      const products = await ordersRepo.getProductsForOrder(productsIds)
      const productsError = this.validateProductsBeforeOrder({
        products,
        productsMap,
      })

      if (productsError) {
        return this.sendResponse({
          success: false,
          status: 422,
          error: productsError,
        })
      }

      let sessionError
      const session = await this.model.startSession()
      session.startTransaction()
      let order
      try {
        const {
          notes,
          phone,
          saveAddress,
          coupon,
          couponDiscount,
          shippingCost,
          paymentMethod,
          ...address
        } = billingDetails

        let couponUsesExceeded = false
        if (coupon) {
          const couponUses = await ordersRepo.getCouponUses({
            userId: req.user._id,
            couponId: coupon,
            session,
          })

          const couponData = await couponsRepo.getCouponById({
            couponId: coupon,
            session,
          })
          if (!couponData) {
            return this.sendResponse({
              success: false,
              status: 400,
              message: "Coupon not found",
            })
          }

          couponUsesExceeded = couponUses >= couponData.numberOfUses
        }

        const items = this.constructOrderItems({ products, productsMap })
        order = await ordersRepo.createOrder({
          order: {
            user: this.req.user._id,
            items,
            shippingCost,
            notes,
            phone,
            address,
            coupon: couponUsesExceeded ? undefined : coupon,
            couponDiscount: couponUsesExceeded ? 0 : couponDiscount,
            paymentMethod,
          },
          session,
        })

        const updateProductsQuery = this.constructUpdateProductsQuery({
          items,
          session,
        })
        await Promise.all(updateProductsQuery)
        if (saveAddress) {
          await usersRepo.updateUser({
            _id: this.req.user._id,
            data: { phone, address },
            session,
          })
        }

        await session.commitTransaction()
        await this.clearCart()
      } catch (error) {
        await session.abortTransaction()
        sessionError = error
      } finally {
        await session.endSession()
      }

      if (sessionError) {
        return this.sendResponse({
          success: false,
          status: 500,
          message: "Error placing order",
        })
      }

      events.emit(EVENT_NAMES.ORDER.EMITTED, order._id)

      return this.sendResponse({
        body: {
          data: order,
        },
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = CreateOrderController
