const router = require("express").Router()
const CreateReviewController = require("../controllers/reviews/reviews.create.controller")
const {
  isAuthenticated,
  authorizeRole,
  isVerified,
} = require("../middlewares/authentication")
const { USER_ROLES } = require("../helpers/constants")

router.use(isAuthenticated, isVerified, authorizeRole(USER_ROLES.CUSTOMER))

router.post("/", CreateReviewController.handle)

module.exports = router
