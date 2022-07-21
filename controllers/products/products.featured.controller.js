const { ApiListController } = require("../../library/xprevalent")
const productModel = require("../../models/product.model")
const productsRepo = require("../../repositories/products.repo")

class FeaturedProductsController extends ApiListController {
  model = productModel
  paginate = true

  async getQueryResult() {
    const { limit } = this.getPaginationParams()
    const newProducts = await productsRepo.getFeaturedProducts({
      type: "new",
      limit,
    })
    const popularProducts = await productsRepo.getFeaturedProducts({
      type: "popular",
      limit,
    })

    return {
      new: newProducts,
      popular: popularProducts,
    }
  }
}

module.exports = FeaturedProductsController
