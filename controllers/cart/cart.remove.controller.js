const CartController = require("./cart.controller")

class RemoveFromCartController extends CartController {
  validateProductsBeforeRemove({ cart, cartSet }) {
    const notFoundProducts = cart.filter(({ _id }) => !cartSet.has(_id))
    return notFoundProducts
  }

  removeProductsFromCart({ cart, cartSet }) {
    return cart.filter(({ _id }) => !cartSet.has(_id))
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
      const cart = this.req.session.cart || []
      const cartSet = this.constructCartSet(cart)
      const notFoundProducts = this.validateProductsBeforeRemove({
        cartSet,
        cart: products,
      })

      if (notFoundProducts.length) {
        return this.sendResponse({
          status: 422,
          message: "Products not found in cart",
          error: {
            products: notFoundProducts.map(({ name }) => name),
          },
        })
      }

      const newCart = this.removeProductsFromCart({
        cart,
        cartSet: this.constructCartSet(products),
      })

      this.req.session.cart = newCart
      this.req.session.save((err) => {
        if (err) {
          return this.next(err)
        }

        return this.sendResponse({
          body: {
            data: this.req.session.cart,
          },
          message: "Products removed from cart successfully",
        })
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = RemoveFromCartController
