const { ApiCreateController } = require("../../../library/xprevalent")
const { ValidationSchema } = require("../../../library/xprevalent/validators")
const testimonialModel = require("../../../models/testimonial.model")
const { testimonialSchema } = require("../../../validation/testimonials.schema")

class CreateTestimonialController extends ApiCreateController {
  model = testimonialModel
  validationSchema = new ValidationSchema(testimonialSchema)
}

module.exports = CreateTestimonialController
