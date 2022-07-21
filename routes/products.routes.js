const router = require("express").Router()
const FeaturedProductsController = require("../controllers/products/products.featured.controller")
const ProductsListController = require("../controllers/products/products.list.controller")
const ProductDetailsController = require("../controllers/products/product.details.controller")

router.get("/", ProductsListController.handle)
router.get("/featured", FeaturedProductsController.handle)
router.get("/:id", ProductDetailsController.handle)

module.exports = router
