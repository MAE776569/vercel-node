const router = require("express").Router()
const TestimonialsListController = require("../controllers/testimonials/testimonials.list.controller")

router.get("/", TestimonialsListController.handle)

module.exports = router
