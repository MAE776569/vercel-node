const { ApiController } = require("../../library/xprevalent")
const { ValidationSchema } = require("../../library/xprevalent/validators")
const { cartItemsSchema } = require("../../validation/cart.schema")
const productModel = require("../../models/product.model")
const cartRepo = require("../../repositories/cart.repo")

class CartController extends ApiController {
  model = productModel
  validationSchema = new ValidationSchema(cartItemsSchema)

  async getProducts(cartProducts) {
    const productIds = cartProducts.map(({ _id }) => _id)
    const products = await cartRepo.getCartProducts({
      productIds,
      inStock: true,
    })

    return products
  }

  async getProductsAfterCartChange(cart) {
    const productIds = cart.map(({ _id }) => _id)
    const cartProducts = await cartRepo.getCartProducts({ productIds })
    const cartMap = this.constructCartMap(cart)
    const cartToDisplay = cartProducts.map((product) => ({
      ...product,
      ...cartMap.get(product._id.toString()),
    }))

    return cartToDisplay
  }

  constructCartSet(cart) {
    return new Set(cart.map(({ _id }) => _id.toString()))
  }

  constructCartMap(cart) {
    const cartMap = new Map()
    cart.forEach(({ _id, quantity, size, color }) => {
      cartMap.set(_id, {
        quantity,
        size,
        color,
      })
    })
    return cartMap
  }
}

module.exports = CartController
