const { validator } = require("../library/xprevalent/validators")

const createContactSchema = {
  body: validator.object({
    name: validator.string().required(),
    email: validator.string().email().required(),
    subject: validator.string().required(),
    comment: validator.string().required(),
  }),
}

module.exports = {
  createContactSchema,
}
