const router = require("express").Router()
const CreateContactController = require("../controllers/contacts/contacts.create.controller")

router.post("/", CreateContactController.handle)

module.exports = router
