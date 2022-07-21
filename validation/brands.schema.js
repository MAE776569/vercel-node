const { validator } = require("../library/xprevalent/validators")

const brandSchema = {
  body: validator.object({
    name: validator.string().trim().required(),
    image: validator.string().url().required(),
  }),
}

module.exports = {
  brandSchema,
}
