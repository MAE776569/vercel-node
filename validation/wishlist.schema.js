const { validator } = require("../library/xprevalent/validators")

const wishlistItemsSchema = {
  body: validator.object({
    products: validator
      .array()
      .of(validator.string().mongoId().required())
      .min(1)
      .required(),
  }),
}

module.exports = {
  wishlistItemsSchema,
}
