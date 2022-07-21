const { ApiDeleteController } = require("../../../library/xprevalent")
const governmentModel = require("../../../models/government.model")

class DeleteGovernmentController extends ApiDeleteController {
  model = governmentModel
}

module.exports = DeleteGovernmentController
