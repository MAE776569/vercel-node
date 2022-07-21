const router = require("express").Router()
const SuspendUserController = require("../../controllers/admin/users/suspendUser.controller")
const SendVerificationEmailController = require("../../controllers/admin/users/sendVerificationEmail.controller")

router.post("/:id/toggle-suspension", SuspendUserController.handle)
router.post("/:id/send-verification", SendVerificationEmailController.handle)

module.exports = router
