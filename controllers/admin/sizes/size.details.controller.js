const { ApiDetailsController } = require("../../../library/xprevalent")
const sizeModel = require("../../../models/size.model")

class SizeDetailsController extends ApiDetailsController {
  model = sizeModel
}

module.exports = SizeDetailsController
