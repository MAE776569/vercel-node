const { ApiController } = require("../../library/xprevalent")
const cartRepo = require("../../repositories/cart.repo")
const { USER_ROLES } = require("../../helpers/constants")

class SessionController extends ApiController {
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

  async handleRequest() {
    try {
      const isAuthenticated = this.req.isAuthenticated()
      const user = isAuthenticated ? this.req.user : {}
      const { email, name, phone, address, role, verifiedAt } = user
      const cart = this.req.session.cart || []

      let cartToDisplay
      if (role?.name !== USER_ROLES.ADMIN) {
        const productIds = cart.map(({ _id }) => _id)
        const cartProducts = await cartRepo.getCartProducts({ productIds })
        const cartMap = this.constructCartMap(cart)
        cartToDisplay = cartProducts.map((product) => ({
          ...product,
          ...cartMap.get(product._id.toString()),
        }))
      }

      return this.sendResponse({
        body: {
          user: {
            name,
            email,
            phone,
            address,
          },
          isAuthenticated,
          isVerified: Boolean(verifiedAt),
          cart: cartToDisplay,
        },
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = SessionController
