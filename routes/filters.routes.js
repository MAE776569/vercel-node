const router = require("express").Router()
const FiltersListController = require("../controllers/filters/filters.list.controller")

router.get("/", FiltersListController.handle)

module.exports = router
