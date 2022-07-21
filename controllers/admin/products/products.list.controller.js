const { ApiListController } = require("../../../library/xprevalent")
const productModel = require("../../../models/product.model")

class ProductsListController extends ApiListController {
  model = productModel
  paginate = true
  populatedFields = ["category", "sizes", "group", "brand"]
  sortBy = { createdAt: -1 }
}

module.exports = ProductsListController
