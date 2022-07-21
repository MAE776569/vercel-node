const { validator } = require("../library/xprevalent/validators")

const collectionSchema = {
  body: validator.object({
    name: validator.string().trim().required(),
    image: validator.string().url().required(),
    subtitle: validator.string().trim().notRequired(),
  }),
}

module.exports = {
  collectionSchema,
}
