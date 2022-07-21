const { ApiCreateController } = require("../../../library/xprevalent")
const { ValidationSchema } = require("../../../library/xprevalent/validators")
const productModel = require("../../../models/product.model")
const { productSchema } = require("../../../validation/products.schema")

class CreateProductController extends ApiCreateController {
  model = productModel
  validationSchema = new ValidationSchema(productSchema)
}

module.exports = CreateProductController
