const router = require("express").Router()
const ConfigListController = require("../controllers/config/config.list.controller")

router.get("/", ConfigListController.handle)

module.exports = router
