const router = require("express").Router()
const FiltersListController = require("../../controllers/admin/filters/filters.list.controller")
const ProductsFilterListController = require("../../controllers/admin/filters/productsFilter.list.controller")

router.get("/", FiltersListController.handle)
router.get("/products", ProductsFilterListController.handle)

module.exports = router
