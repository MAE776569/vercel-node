const { ApiEditController } = require("../../../library/xprevalent")
const { ValidationSchema } = require("../../../library/xprevalent/validators")
const categoryModel = require("../../../models/category.model")
const { categorySchema } = require("../../../validation/categories.schema")

class EditCategoryController extends ApiEditController {
  model = categoryModel
  validationSchema = new ValidationSchema(categorySchema)
}

module.exports = EditCategoryController
