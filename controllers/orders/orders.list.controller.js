const { ApiController } = require("../../library/xprevalent")
const ordersRepo = require("../../repositories/orders.repo")

class ListUserOrdersController extends ApiController {
  getQueryResult() {
    return ordersRepo.getUserOrders(this.req.user._id)
  }

  async handleRequest() {
    try {
      const orders = await this.getQueryResult()
      return this.sendResponse({
        body: {
          data: orders,
        },
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = ListUserOrdersController
