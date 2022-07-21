const { ApiEditController } = require("../../../library/xprevalent")
const { ValidationSchema } = require("../../../library/xprevalent/validators")
const couponModel = require("../../../models/coupon.model")
const couponsRepo = require("../../../repositories/coupons.repo")
const { couponSchema } = require("../../../validation/coupons.schema")

class EditCouponController extends ApiEditController {
  model = couponModel
  validationSchema = new ValidationSchema(couponSchema)

  async handleRequest() {
    try {
      const { name } = this.getUpdateSet()
      const id = this.req.params[this.idParam]
      const coupon = await couponsRepo.getCouponByName({ name, id })
      if (coupon) {
        return this.sendResponse({
          success: false,
          status: 422,
          message: "Coupon already exist",
        })
      }
      return await super.handleRequest()
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = EditCouponController
