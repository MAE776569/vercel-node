const { validator } = require("../library/xprevalent/validators")

const cartItemsSchema = {
  body: validator.object({
    products: validator
      .array()
      .of(
        validator.object({
          _id: validator.string().mongoId().required(),
          name: validator.string().required(),
          quantity: validator.number().integer().positive().required(),
          price: validator.number().positive().required(),
          thumbnail: validator.string().required(),
          size: validator.string().notRequired(),
          color: validator.string().notRequired(),
        }),
      )
      .min(1)
      .required(),
  }),
}
module.exports = {
  cartItemsSchema,
}
