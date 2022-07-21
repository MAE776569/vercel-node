const { ApiListController } = require("../../library/xprevalent")
const collectionModel = require("../../models/collection.model")

class CollectionsListController extends ApiListController {
  model = collectionModel
}

module.exports = CollectionsListController
