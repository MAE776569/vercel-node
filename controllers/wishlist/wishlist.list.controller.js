const { ApiController } = require("../../library/xprevalent")
const wishlistRepo = require("../../repositories/wishlist.repo")

class WishlistItemsController extends ApiController {
  getQueryResult() {
    return wishlistRepo.getProductsInWishlist(this.req.user._id)
  }

  async handleRequest() {
    try {
      const wishlist = await this.getQueryResult()
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

module.exports = WishlistItemsController
