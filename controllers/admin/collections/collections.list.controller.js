const { ApiListController } = require("../../../library/xprevalent")
const collectionModel = require("../../../models/collection.model")

class CollectionsListController extends ApiListController {
  model = collectionModel
  paginate = true
  sortBy = { createdAt: -1 }

  getQueryFilter() {
    return {
      deletedAt: { $eq: null },
    }
  }
}

module.exports = CollectionsListController
