const { validator } = require("../library/xprevalent/validators")

const governmentSchema = {
  body: validator.object({
    name: validator.string().trim().required(),
    shippingCost: validator.number().positive().required(),
  }),
}

module.exports = {
  governmentSchema,
}
