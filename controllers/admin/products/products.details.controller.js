const { ApiDetailsController } = require("../../../library/xprevalent")
const productModel = require("../../../models/product.model")

class ProductDetailsController extends ApiDetailsController {
  model = productModel
  populatedFields = ["category", "sizes", "group", "brand"]
}

module.exports = ProductDetailsController
