const router = require("express").Router()
const ConfigListController = require("../../controllers/admin/config/config.list.controller")
const EditConfigController = require("../../controllers/admin/config/config.edit.controller")

router.get("/", ConfigListController.handle)
router.put("/:key", EditConfigController.handle)

module.exports = router
