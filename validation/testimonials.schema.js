const { validator } = require("../library/xprevalent/validators")

const testimonialSchema = {
  body: validator.object({
    body: validator.string().trim().required(),
    user: validator.string().trim().required(),
    image: validator.string().url().required(),
    visible: validator.boolean().notRequired().default(true),
  }),
}

module.exports = {
  testimonialSchema,
}
