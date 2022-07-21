const router = require("express").Router()
const CollectionsListController = require("../controllers/collections/collections.list.controller")

router.get("/", CollectionsListController.handle)

module.exports = router
