const router = require("express").Router()
const OrdersListController = require("../../controllers/admin/orders/orders.list.controller")
const OrderDetailsController = require("../../controllers/admin/orders/order.details.controller")
const EditOrderController = require("../../controllers/admin/orders/order.edit.controller")

router.get("/", OrdersListController.handle)
router.get("/:id", OrderDetailsController.handle)
router.put("/:id", EditOrderController.handle)

module.exports = router
