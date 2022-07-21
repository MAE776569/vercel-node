const CartController = require("./cart.controller")

class AddToCartController extends CartController {
  validateProductsBeforeAdd({ cartSet, cart }) {
    const notFoundProducts = cart.filter(({ _id }) => !cartSet.has(_id))
    return notFoundProducts
  }

  addProductsToCart({ products, cart, cartSet }) {
    products.forEach((product) => {
      if (!cartSet.has(product._id)) {
        cart.push(product)
      }
    })

    return cart
  }

  saveSession() {
    return new Promise((resolve, reject) => {
      this.req.session.save((err) => {
        if (err) reject(err)
        resolve()
      })
    })
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
      const notFoundProducts = this.validateProductsBeforeAdd({
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

      const cart = this.req.session.cart || []
      const cartSet = this.constructCartSet(cart)
      const newCart = this.addProductsToCart({ products, cart, cartSet })

      this.req.session.cart = newCart
      await this.saveSession()

      const cartToDisplay = await this.getProductsAfterCartChange(newCart)
      return this.sendResponse({
        body: {
          data: cartToDisplay,
        },
        message: "Products added to cart successfully",
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = AddToCartController
