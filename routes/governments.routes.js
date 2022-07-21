const router = require("express").Router()
const GovernmentsListController = require("../controllers/governments/governments.list.controller")

router.get("/", GovernmentsListController.handle)

module.exports = router
