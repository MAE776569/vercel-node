const { ApiController } = require("../../library/xprevalent")
const { ValidationSchema } = require("../../library/xprevalent/validators")
const couponsRepo = require("../../repositories/coupons.repo")
const { inquireCouponSchema } = require("../../validation/coupons.schema")

class InquireCouponController extends ApiController {
  validationSchema = new ValidationSchema(inquireCouponSchema)

  getQueryResult(filter) {
    return couponsRepo.inquireCoupon(filter)
  }

  async handleRequest() {
    const validationResult = await this.validationSchema.validate(this.req)
    if (validationResult.hasError({ location: "body" })) {
      return this.sendResponse({
        status: 422,
        error: validationResult.getErrors("body"),
      })
    }

    const filter = validationResult.getValue("body")
    const queryResult = await this.getQueryResult(filter)
    return this.sendResponse({
      body: {
        data: {
          valid: !!queryResult?.length,
          coupon: queryResult[0],
        },
      },
    })
  }
}

module.exports = InquireCouponController
