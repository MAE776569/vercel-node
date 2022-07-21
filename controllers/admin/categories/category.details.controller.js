const { ApiDetailsController } = require("../../../library/xprevalent")
const categoryModel = require("../../../models/category.model")

class CategoryDetailsController extends ApiDetailsController {
  model = categoryModel
}

module.exports = CategoryDetailsController
