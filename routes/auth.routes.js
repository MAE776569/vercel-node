const router = require("express").Router()
const SignupUserController = require("../controllers/auth/signup.controller")
const LoginController = require("../controllers/auth/login.controller")
const SessionController = require("../controllers/auth/session.controller")
const LogoutController = require("../controllers/auth/logout.controller")
const AccountVerificationController = require("../controllers/auth/verification.controller")
const {
  isAuthenticated,
  authorizeRole,
} = require("../middlewares/authentication")
const { USER_ROLES } = require("../helpers/constants")

router.post("/signup", SignupUserController.handle)
router.post("/login", LoginController.handle)
router.post("/session", SessionController.handle)
router.post("/logout", isAuthenticated, LogoutController.handle)
router.post(
  "/verify/:token",
  isAuthenticated,
  authorizeRole(USER_ROLES.CUSTOMER),
  AccountVerificationController.handle,
)

module.exports = router
