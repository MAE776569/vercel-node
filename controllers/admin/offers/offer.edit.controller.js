const { ApiEditController } = require("../../../library/xprevalent")
const { ValidationSchema } = require("../../../library/xprevalent/validators")
const offerModel = require("../../../models/offer.model")
const offersRepo = require("../../../repositories/offers.repo")
const { offerSchema } = require("../../../validation/offers.schema")

class EditOfferController extends ApiEditController {
  model = offerModel
  validationSchema = new ValidationSchema(offerSchema)

  async getLastActiveDeal(id) {
    const updateSet = this.getUpdateSet()
    if (updateSet.deal?.isActive) {
      const activeDeal = await offersRepo.getActiveDeal(id)
      return activeDeal
    }
    return false
  }

  async handleRequest() {
    try {
      if (this.validateIdParam() && !this.updateOne) {
        return this.sendResponse({
          success: false,
          status: 404,
          message: "Invalid id",
        })
      }
      if (this.validationResult.hasError({ location: "body" })) {
        return this.sendResponse({
          success: false,
          status: 422,
          error: this.validationResult.getErrors({ location: "body" }),
        })
      }

      const id = this.req.params[this.idParam]
      const lastActiveDeal = await this.getLastActiveDeal(id)
      if (lastActiveDeal) {
        return this.sendResponse({
          success: false,
          status: 422,
          message: "There is already an offer with a deal",
        })
      }

      const queryResult = await this.getQueryResult()
      if (!queryResult) {
        return this.sendResponse({
          success: false,
          status: 404,
          message: "Not found",
        })
      }

      const contextObject = await this.getContextObject()
      const resObject = Object.assign({}, contextObject)
      resObject[this.queryObjectName] = queryResult
      return this.sendResponse({
        body: resObject,
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = EditOfferController
