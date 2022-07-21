const { ApiListController } = require("../../library/xprevalent")
const testimonialModel = require("../../models/testimonial.model")

class TestimonialsListController extends ApiListController {
  model = testimonialModel

  getQueryFilter() {
    return {
      visible: true,
    }
  }
}

module.exports = TestimonialsListController
