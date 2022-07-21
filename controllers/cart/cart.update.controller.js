const CartController = require("./cart.controller")

class UpdateCartController extends CartController {
  validateProductsBeforeUpdate({ cartSet, cart }) {
    const notFoundProducts = cart.filter(({ _id }) => !cartSet.has(_id))
    return notFoundProducts
  }

  constructProductsMap(products) {
    const productsMap = new Map()
    products.forEach((product) => {
      productsMap.set(product._id.toString(), {
        ...product,
        _id: product._id.toString(),
      })
    })

    return productsMap
  }

  updateCart({ productsMap, cartMap }) {
    const cart = []
    const cartToDisplay = []
    productsMap.forEach((product, _id) => {
      const clonedProduct = Object.assign({}, product)
      delete clonedProduct.sizes
      delete clonedProduct.colors
      const productFromCart = cartMap.get(_id)
      if (productFromCart) {
        const { quantity, color, size } = productFromCart
        cart.push({
          ...clonedProduct,
          quantity,
          color,
          size,
        })
        cartToDisplay.push({
          ...product,
          quantity,
          color,
          size,
        })
      }
    })

    return {
      cart,
      cartToDisplay,
    }
  }

  async handleRequest() {
    try {
      const validationResult = this.validationSchema.validate(this.req)
      if (validationResult.hasError({ location: "body" })) {
        return this.sendResponse({
          status: 422,
          error: validationResult.getErrors({ location: "body" }),
        })
      }

      const { products } = validationResult.getValue("body")
      const productsFromDb = await this.getProducts(products)
      const notFoundProducts = this.validateProductsBeforeUpdate({
        cartSet: this.constructCartSet(productsFromDb),
        cart: products,
      })

      if (notFoundProducts.length) {
        return this.sendResponse({
          status: 422,
          message: "Products not found or out of stock",
          error: {
            products: notFoundProducts.map(({ name }) => name),
          },
        })
      }

      const productsMap = this.constructProductsMap(productsFromDb)
      const cartMap = this.constructProductsMap(products)
      const { cart: newCart, cartToDisplay } = this.updateCart({
        productsMap,
        cartMap,
      })

      this.req.session.cart = newCart
      this.req.session.save((err) => {
        if (err) {
          return this.next(err)
        }

        return this.sendResponse({
          body: {
            data: cartToDisplay,
          },
          message: "Cart updated successfully",
        })
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = UpdateCartController
