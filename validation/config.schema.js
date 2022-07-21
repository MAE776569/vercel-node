const { validator } = require("../library/xprevalent/validators")

const configSchema = {
  body: validator.object({
    // key: validator.string().trim().required(),
    value: validator.mixed().required(),
  }),
}

module.exports = {
  configSchema,
}
