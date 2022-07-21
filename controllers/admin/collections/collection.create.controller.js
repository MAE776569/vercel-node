const { ApiCreateController } = require("../../../library/xprevalent")
const { ValidationSchema } = require("../../../library/xprevalent/validators")
const collectionModel = require("../../../models/collection.model")
const { collectionSchema } = require("../../../validation/collections.schema")

class CreateCollectionController extends ApiCreateController {
  model = collectionModel
  validationSchema = new ValidationSchema(collectionSchema)
}

module.exports = CreateCollectionController
