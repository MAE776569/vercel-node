const router = require("express").Router()
const ProductDetailsController = require("../../controllers/admin/products/products.details.controller")
const CreateProductController = require("../../controllers/admin/products/product.create.controller")
const ProductsListController = require("../../controllers/admin/products/products.list.controller")
const EditProductController = require("../../controllers/admin/products/product.edit.controller")

router.get("/", ProductsListController.handle)
router.get("/:id", ProductDetailsController.handle)
router.post("/", CreateProductController.handle)
router.put("/:id", EditProductController.handle)

module.exports = router
