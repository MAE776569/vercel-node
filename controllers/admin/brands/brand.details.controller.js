const { ApiDetailsController } = require("../../../library/xprevalent")
const brandModel = require("../../../models/brand.model")

class BrandDetailsController extends ApiDetailsController {
  model = brandModel
}

module.exports = BrandDetailsController
