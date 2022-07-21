const { validator } = require("../library/xprevalent/validators")

const createReviewSchema = {
  body: validator.object({
    rating: validator.number().positive().min(0).max(5).required(),
    comment: validator.string().required(),
    product: validator.string().mongoId().required(),
  }),
}

module.exports = {
  createReviewSchema,
}
