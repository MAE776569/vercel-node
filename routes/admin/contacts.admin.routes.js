const router = require("express").Router()
const ContactsListController = require("../../controllers/admin/contacts/contacts.list.controller")

router.get("/", ContactsListController.handle)

module.exports = router
