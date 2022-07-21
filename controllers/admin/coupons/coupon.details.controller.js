const { ApiDetailsController } = require("../../../library/xprevalent")
const couponModel = require("../../../models/coupon.model")

class CouponDetailsController extends ApiDetailsController {
  model = couponModel
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
      path: "products",
      select: "_id name",
    },
  ]
}

module.exports = CouponDetailsController
