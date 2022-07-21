const { ApiEditController } = require("../../../library/xprevalent")
const { ValidationSchema } = require("../../../library/xprevalent/validators")
const brandModel = require("../../../models/brand.model")
const { brandSchema } = require("../../../validation/brands.schema")

class EditBrandController extends ApiEditController {
  model = brandModel
  validationSchema = new ValidationSchema(brandSchema)
}

module.exports = EditBrandController
