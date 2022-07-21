const router = require("express").Router()
const {
  isAuthenticated,
  authorizeRole,
  isVerified,
} = require("../middlewares/authentication")
const WishlistItemsController = require("../controllers/wishlist/wishlist.list.controller")
const AddToWishlistController = require("../controllers/wishlist/wishlist.add.controller")
const RemoveFromWishlistController = require("../controllers/wishlist/wishlist.remove.controller")
const { USER_ROLES } = require("../helpers/constants")

router.use(isAuthenticated, isVerified, authorizeRole(USER_ROLES.CUSTOMER))

router.get("/", WishlistItemsController.handle)
router.post("/", AddToWishlistController.handle)
router.post("/delete", RemoveFromWishlistController.handle)

module.exports = router
