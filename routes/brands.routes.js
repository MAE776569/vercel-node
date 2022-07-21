const router = require("express").Router()
const BrandsListController = require("../controllers/brands/brands.list.controller")

router.get("/", BrandsListController.handle)

module.exports = router
