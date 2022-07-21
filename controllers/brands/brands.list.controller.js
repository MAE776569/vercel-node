const { ApiListController } = require("../../library/xprevalent")
const brandModel = require("../../models/brand.model")

class BrandsListController extends ApiListController {
  model = brandModel
}

module.exports = BrandsListController
