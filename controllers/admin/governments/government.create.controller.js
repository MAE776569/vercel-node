const { ApiCreateController } = require("../../../library/xprevalent")
const { ValidationSchema } = require("../../../library/xprevalent/validators")
const governmentModel = require("../../../models/government.model")
const { governmentSchema } = require("../../../validation/governments.schema")

class CreateGovernmentController extends ApiCreateController {
  model = governmentModel
  validationSchema = new ValidationSchema(governmentSchema)
}

module.exports = CreateGovernmentController
