const { ApiDetailsController } = require("../../library/xprevalent")
const productModel = require("../../models/product.model")
const productsRepo = require("../../repositories/products.repo")

class ProductDetailsController extends ApiDetailsController {
  model = productModel

  async getQueryResult() {
    const productId = this.req.params[this.idParam]
    const productResult = await productsRepo.getProductDetails(productId)
    const product = productResult[0]
    const reviews = await productsRepo.getProductReviews(productId)
    const relatedProducts = await productsRepo.getRelatedProducts({
      productId,
      categoryId: product.category._id,
    })

    return {
      product: product,
      reviews: reviews,
      relatedProducts,
    }
  }
}

module.exports = ProductDetailsController
