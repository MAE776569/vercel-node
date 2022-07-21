const router = require("express").Router()
const CategoriesListController = require("../controllers/categories/categories.list.controller")

router.get("/", CategoriesListController.handle)

module.exports = router
