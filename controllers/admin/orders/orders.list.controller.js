const { ApiListController } = require("../../../library/xprevalent")
const orderModel = require("../../../models/order.model")
const ordersRepo = require("../../../repositories/orders.repo")

class OrdersListController extends ApiListController {
  model = orderModel
  paginate = true
  sortBy = { createdAt: -1 }

  getQueryResult() {
    const { page, limit } = this.getPaginationParams()
    return ordersRepo.getOrdersForAdmin({
      page,
      limit,
      sort: this.sortBy,
    })
  }
}

module.exports = OrdersListController
