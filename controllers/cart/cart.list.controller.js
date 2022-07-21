const { ApiController } = require("../../library/xprevalent")
const cartRepo = require("../../repositories/cart.repo")

class CartListController extends ApiController {
  getQueryResult() {
    const productIds = (this.req.session.cart || []).map(({ _id }) => _id)
    return cartRepo.getCartProducts({ productIds })
  }

  async handleRequest() {
    try {
      const cart = await this.getQueryResult()
      return this.sendResponse({
        body: {
          data: cart,
        },
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = CartListController
