const { ApiDetailsController } = require("../../../library/xprevalent")
const testimonialModel = require("../../../models/testimonial.model")

class TestimonialDetailsController extends ApiDetailsController {
  model = testimonialModel
}

module.exports = TestimonialDetailsController
