const router = require("express").Router()
const SizeDetailsController = require("../../controllers/admin/sizes/size.details.controller")
const CreateSizeController = require("../../controllers/admin/sizes/size.create.controller")
const SizesListController = require("../../controllers/admin/sizes/sizes.list.controller")
const EditSizeController = require("../../controllers/admin/sizes/size.edit.controller")

router.get("/", SizesListController.handle)
router.get("/:id", SizeDetailsController.handle)
router.post("/", CreateSizeController.handle)
router.put("/:id", EditSizeController.handle)

module.exports = router
