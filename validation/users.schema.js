const { validator } = require("../library/xprevalent/validators")

const userIdSchema = {
  params: validator.object({
    id: validator.string().mongoId().required(),
  }),
}

module.exports = {
  userIdSchema,
}
