const { ApiCreateController } = require("../../../library/xprevalent")
const { ValidationSchema } = require("../../../library/xprevalent/validators")
const sizeModel = require("../../../models/size.model")
const { sizeSchema } = require("../../../validation/sizes.schema")

class CreateSizeController extends ApiCreateController {
  model = sizeModel
  validationSchema = new ValidationSchema(sizeSchema)
}

module.exports = CreateSizeController
