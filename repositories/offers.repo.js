const offerModel = require("../models/offer.model")

class OffersRepo {
  getActiveDeal(id) {
    const queryFilter = {
      expireAt: { $gt: new Date() },
      deal: { $ne: null },
      "deal.isActive": true,
    }
    if (id) {
      queryFilter._id = { $ne: id }
    }
    return offerModel.findOne(queryFilter)
  }
}

module.exports = new OffersRepo()
