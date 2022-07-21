const WishlistController = require("./wishlist.controller")
const wishlistRepo = require("../../repositories/wishlist.repo")

class RemoveFromWishlistController extends WishlistController {
  async getProductsFromDb(productIds) {
    const { wishlist } = await wishlistRepo.getProductsToRemoveFromWishlist({
      userId: this.req.user._id,
      productIds,
    })

    return wishlist
  }

  getQueryResult() {
    const { products } = this.getDocument()
    return wishlistRepo.removeProductsFromWishlist({
      userId: this.req.user._id,
      products,
    })
  }
}

module.exports = RemoveFromWishlistController
