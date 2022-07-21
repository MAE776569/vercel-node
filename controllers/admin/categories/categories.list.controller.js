const { ApiListController } = require("../../../library/xprevalent")
const categoryModel = require("../../../models/category.model")

class CategoriesListController extends ApiListController {
  model = categoryModel
  paginate = true
  sortBy = { createdAt: -1 }

  getQueryFilter() {
    return {
      deletedAt: { $eq: null },
    }
  }
}

module.exports = CategoriesListController
