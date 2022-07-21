const { ApiListController } = require("../../../library/xprevalent")
const testimonialModel = require("../../../models/testimonial.model")

class TestimonialsListController extends ApiListController {
  model = testimonialModel
  paginate = true
  sortBy = { createdAt: -1 }
}

module.exports = TestimonialsListController
