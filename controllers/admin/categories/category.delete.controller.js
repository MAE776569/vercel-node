const { ApiDeleteController } = require("../../../library/xprevalent")
const categoryModel = require("../../../models/category.model")

class DeleteCategoryController extends ApiDeleteController {
  model = categoryModel

  getQueryResult() {
    const id = this.req.params[this.idParam]
    return this.model.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
      },
      { new: true },
    )
  }
}

module.exports = DeleteCategoryController
