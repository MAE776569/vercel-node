const WishlistController = require("./wishlist.controller")
const wishlistRepo = require("../../repositories/wishlist.repo")

class AddToWishlistController extends WishlistController {
  getQueryResult() {
    const { products } = this.getDocument()
    return wishlistRepo.addProductsToWishList({
      userId: this.req.user._id,
      products,
    })
  }
}

module.exports = AddToWishlistController
