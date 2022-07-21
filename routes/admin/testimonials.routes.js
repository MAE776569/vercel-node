const router = require("express").Router()
const TestimonialDetailsController = require("../../controllers/admin/testimonials/testimonial.details.controller")
const CreateTestimonialController = require("../../controllers/admin/testimonials/testimonial.create.controller")
const TestimonialsListController = require("../../controllers/admin/testimonials/testimonials.list.controller")
const EditTestimonialController = require("../../controllers/admin/testimonials/testimonial.edit.controller")
const DeleteTestimonialController = require("../../controllers/admin/testimonials/testimonial.delete.controller")

router.get("/", TestimonialsListController.handle)
router.get("/:id", TestimonialDetailsController.handle)
router.post("/", CreateTestimonialController.handle)
router.put("/:id", EditTestimonialController.handle)
router.delete("/:id", DeleteTestimonialController.handle)

module.exports = router
