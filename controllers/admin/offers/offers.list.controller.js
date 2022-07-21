const { ApiListController } = require("../../../library/xprevalent")
const offerModel = require("../../../models/offer.model")

class OffersListController extends ApiListController {
  model = offerModel
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

module.exports = OffersListController
