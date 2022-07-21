const { validator } = require("../library/xprevalent/validators")

const comparisonListSchema = {
  body: validator.object({
    products: validator
      .array()
      .of(validator.string().mongoId().required())
      .min(1)
      .required(),
  }),
}

module.exports = {
  comparisonListSchema,
}
