const { ApiCreateController } = require("../../../library/xprevalent")
const { ValidationSchema } = require("../../../library/xprevalent/validators")
const offerModel = require("../../../models/offer.model")
const offersRepo = require("../../../repositories/offers.repo")
const { offerSchema } = require("../../../validation/offers.schema")

class CreateOfferController extends ApiCreateController {
  model = offerModel
  validationSchema = new ValidationSchema(offerSchema)

  async getLastActiveDeal() {
    const document = this.getDocument()
    if (document.deal?.isActive) {
      const activeDeal = await offersRepo.getActiveDeal()
      return activeDeal
    }
    return false
  }

  async handleRequest() {
    try {
      if (this.validationResult.hasError({ location: "body" })) {
        return this.sendResponse({
          status: 422,
          error: this.validationResult.getErrors({ location: "body" }),
        })
      }

      const lastActiveDeal = await this.getLastActiveDeal()
      if (lastActiveDeal) {
        return this.sendResponse({
          status: 422,
          message: "There is already an offer with a deal",
        })
      }

      const queryResult = await this.getQueryResult()
      const contextObject = await this.getContextObject()
      const resObject = Object.assign({}, contextObject)
      resObject[this.queryObjectName] = queryResult
      return this.sendResponse({
        status: 201,
        body: resObject,
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = CreateOfferController
