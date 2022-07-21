const router = require("express").Router()
const CartListController = require("../controllers/cart/cart.list.controller")
const AddToCartController = require("../controllers/cart/cart.add.controller")
const RemoveFromCartController = require("../controllers/cart/cart.remove.controller")
const UpdateCartController = require("../controllers/cart/cart.update.controller")

router.get("/", CartListController.handle)
router.post("/", AddToCartController.handle)
router.post("/delete", RemoveFromCartController.handle)
router.put("/", UpdateCartController.handle)

module.exports = router
