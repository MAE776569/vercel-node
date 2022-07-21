const { ApiEditController } = require("../../../library/xprevalent")
const { ValidationSchema } = require("../../../library/xprevalent/validators")
const sizeModel = require("../../../models/size.model")
const { sizeSchema } = require("../../../validation/sizes.schema")

class EditSizeController extends ApiEditController {
  model = sizeModel
  validationSchema = new ValidationSchema(sizeSchema)
}

module.exports = EditSizeController
