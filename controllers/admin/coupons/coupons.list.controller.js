const { ApiListController } = require("../../../library/xprevalent")
const couponModel = require("../../../models/coupon.model")

class CouponsListController extends ApiListController {
  model = couponModel
  paginate = true
  sortBy = { createdAt: -1 }
  populatedFields = [
    {
      path: "categories",
      select: "_id name",
    },
    {
      path: "groups",
      select: "_id name",
    },
    {
      path: "brands",
      select: "_id name",
    },
    {
      path: "products",
      select: "_id name",
    },
  ]
}

module.exports = CouponsListController
