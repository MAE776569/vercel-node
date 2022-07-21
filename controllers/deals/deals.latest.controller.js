const { ApiDetailsController } = require("../../library/xprevalent")
const offerModel = require("../../models/offer.model")

class LatestDealController extends ApiDetailsController {
  model = offerModel
  findOne = true
  sortBy = { createdAt: -1 }

  getQueryFilter() {
    return {
      expireAt: { $gt: new Date() },
      deal: { $ne: null },
      "deal.isActive": true,
    }
  }

  async handleRequest() {
    try {
      const offer = await this.getQueryResult()
      let latestDeal = null
      if (offer) {
        latestDeal = Object.assign({}, offer?.deal?.toJSON())
        latestDeal.expireAt = offer?.expireAt
      }

      return this.sendResponse({
        body: { data: latestDeal },
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = LatestDealController
