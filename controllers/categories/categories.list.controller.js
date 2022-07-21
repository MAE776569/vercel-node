const { ApiListController } = require("../../library/xprevalent")
const categoryModel = require("../../models/category.model")

class CategoriesListController extends ApiListController {
  model = categoryModel
}

module.exports = CategoriesListController
