const router = require("express").Router()
const {
  isAuthenticated,
  authorizeRole,
  isVerified,
} = require("../middlewares/authentication")
const CreateOrderController = require("../controllers/orders/order.create.controller")
const ListUserOrdersController = require("../controllers/orders/orders.list.controller")
const OrderDetailsController = require("../controllers/orders/order.details.controller")
const { USER_ROLES } = require("../helpers/constants")

router.use(isAuthenticated, isVerified, authorizeRole(USER_ROLES.CUSTOMER))

router.post("/", CreateOrderController.handle)
router.get("/", ListUserOrdersController.handle)
router.get("/:id", OrderDetailsController.handle)

module.exports = router
