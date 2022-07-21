const { validator } = require("../library/xprevalent/validators")

const categorySchema = {
  body: validator.object({
    name: validator.string().trim().required(),
    image: validator.string().url().required(),
    description: validator.string().trim().notRequired(),
  }),
}

module.exports = {
  categorySchema,
}
