const { ApiEditController } = require("../../../library/xprevalent")
const { ValidationSchema } = require("../../../library/xprevalent/validators")
const collectionModel = require("../../../models/collection.model")
const { collectionSchema } = require("../../../validation/collections.schema")

class EditCollectionController extends ApiEditController {
  model = collectionModel
  validationSchema = new ValidationSchema(collectionSchema)
}

module.exports = EditCollectionController
