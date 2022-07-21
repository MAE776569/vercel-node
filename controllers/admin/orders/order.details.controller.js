const { ApiDetailsController } = require("../../../library/xprevalent")
const orderModel = require("../../../models/order.model")
const ordersRepo = require("../../../repositories/orders.repo")

class OrderDetailsController extends ApiDetailsController {
  model = orderModel
  async getQueryResult() {
    const orderId = this.req.params[this.idParam]
    const queryResult = await ordersRepo.getOrderDetailsForAdmin(orderId)
    return queryResult[0]
  }
}

module.exports = OrderDetailsController
