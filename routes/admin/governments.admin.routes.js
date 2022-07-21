const router = require("express").Router()
const GovernmentsListController = require("../../controllers/admin/governments/governments.list.controller")
const GovernmentDetailsController = require("../../controllers/admin/governments/government.details.controller")
const CreateGovernmentController = require("../../controllers/admin/governments/government.create.controller")
const EditGovernmentController = require("../../controllers/admin/governments/government.edit.controller")
const DeleteGovernmentController = require("../../controllers/admin/governments/government.delete.controller")

router.get("/", GovernmentsListController.handle)
router.get("/:id", GovernmentDetailsController.handle)
router.post("/", CreateGovernmentController.handle)
router.put("/:id", EditGovernmentController.handle)
router.delete("/:id", DeleteGovernmentController.handle)

module.exports = router
