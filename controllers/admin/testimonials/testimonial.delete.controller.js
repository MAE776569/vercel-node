const { ApiDeleteController } = require("../../../library/xprevalent")
const testimonialModel = require("../../../models/testimonial.model")

class DeleteTestimonialController extends ApiDeleteController {
  model = testimonialModel
}

module.exports = DeleteTestimonialController
