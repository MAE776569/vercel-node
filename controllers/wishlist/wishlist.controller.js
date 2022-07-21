const { ApiCreateController } = require("../../library/xprevalent")
const { ValidationSchema } = require("../../library/xprevalent/validators")
const { wishlistItemsSchema } = require("../../validation/wishlist.schema")
const productsRepo = require("../../repositories/products.repo")

class AddToWishlistController extends ApiCreateController {
  validationSchema = new ValidationSchema(wishlistItemsSchema)

  getProductsFromDb(productIds) {
    return productsRepo.getProductsByIds(productIds)
  }

  async handleRequest() {
    try {
      if (this.validationResult.hasError({ location: "body" })) {
        return this.sendResponse({
          status: 422,
          error: this.validationResult.getErrors({ location: "body" }),
        })
      }

      const { products: productIds } = this.getDocument()
      const products = await this.getProductsFromDb(productIds)
      if (products.length !== productIds.length) {
        return this.sendResponse({
          status: 422,
          message: "Products not found",
        })
      }

      const { wishlist } = await this.getQueryResult()
      return this.sendResponse({
        body: {
          data: wishlist,
        },
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = AddToWishlistController
