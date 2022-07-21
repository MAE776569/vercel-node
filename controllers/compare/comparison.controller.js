const { ApiController } = require("../../library/xprevalent")
const { ValidationSchema } = require("../../library/xprevalent/validators")
const productModel = require("../../models/product.model")
const productsRepo = require("../../repositories/products.repo")
const { comparisonListSchema } = require("../../validation/comparison.schema")

class ComparisonController extends ApiController {
  model = productModel
  validationSchema = new ValidationSchema(comparisonListSchema)

  async getProducts(comparisonList) {
    return productsRepo.getProductsByIds(comparisonList)
  }

  constructComparisonSet(productsList) {
    return new Set(productsList)
  }
}

module.exports = ComparisonController
