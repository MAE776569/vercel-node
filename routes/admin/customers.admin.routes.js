const router = require("express").Router()
const CustomersListController = require("../../controllers/admin/customers/customers.list.controller")

router.get("/", CustomersListController.handle)

module.exports = router
