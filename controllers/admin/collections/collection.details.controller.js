const { ApiDetailsController } = require("../../../library/xprevalent")
const collectionModel = require("../../../models/collection.model")

class CollectionDetailsController extends ApiDetailsController {
  model = collectionModel
}

module.exports = CollectionDetailsController
