const { ApiEditController } = require("../../../library/xprevalent")
const { ValidationSchema } = require("../../../library/xprevalent/validators")
const configModel = require("../../../models/config.model")
const { configSchema } = require("../../../validation/config.schema")

class EditConfigController extends ApiEditController {
  model = configModel
  validationSchema = new ValidationSchema(configSchema)
  updateOne = true
  upsert = true

  getQueryFilter() {
    const { key } = this.req.params
    return { key }
  }
}

module.exports = EditConfigController
