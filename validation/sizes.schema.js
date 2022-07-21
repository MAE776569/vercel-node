const { SIZE_PERIODS } = require("../helpers/constants")
const { validator } = require("../library/xprevalent/validators")

const sizeSchema = {
  body: validator.object({
    interval: validator
      .array()
      .length(2)
      .of(validator.number().positive().moreThan(0).required())
      .required(),
    period: validator.string().oneOf(SIZE_PERIODS).required(),
  }),
}

module.exports = {
  sizeSchema,
}
