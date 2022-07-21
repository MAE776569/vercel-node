const { ApiCreateController } = require("../../../library/xprevalent")
const { ValidationSchema } = require("../../../library/xprevalent/validators")
const categoryModel = require("../../../models/category.model")
const { categorySchema } = require("../../../validation/categories.schema")

class CreateCategoryController extends ApiCreateController {
  model = categoryModel
  validationSchema = new ValidationSchema(categorySchema)
}

module.exports = CreateCategoryController
