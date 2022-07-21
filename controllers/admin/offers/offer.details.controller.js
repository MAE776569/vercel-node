const { ApiDetailsController } = require("../../../library/xprevalent")
const offerModel = require("../../../models/offer.model")

class OfferDetailsController extends ApiDetailsController {
  model = offerModel
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

module.exports = OfferDetailsController
