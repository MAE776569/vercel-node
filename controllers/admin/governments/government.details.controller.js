const { ApiDetailsController } = require("../../../library/xprevalent")
const governmentModel = require("../../../models/government.model")

class GovernmentDetailsController extends ApiDetailsController {
  model = governmentModel
}

module.exports = GovernmentDetailsController
