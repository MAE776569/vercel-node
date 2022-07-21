const { ApiDetailsController } = require("../../library/xprevalent")
const orderModel = require("../../models/order.model")
const ordersRepo = require("../../repositories/orders.repo")

class OrderDetailsController extends ApiDetailsController {
  model = orderModel

  async getQueryResult() {
    const orderQueryResult = await ordersRepo.getOrderDetails({
      userId: this.req.user._id,
      orderId: this.req.params[this.idParam],
    })
    return orderQueryResult[0]
  }
}

module.exports = OrderDetailsController
