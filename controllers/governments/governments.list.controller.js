const { ApiListController } = require("../../library/xprevalent")
const governmentModel = require("../../models/government.model")

class GovernmentsListController extends ApiListController {
  model = governmentModel
}

module.exports = GovernmentsListController
