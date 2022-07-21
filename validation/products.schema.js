const { validator } = require("../library/xprevalent/validators")

const productSchema = {
  body: validator.object({
    name: validator.string().trim().required(),
    price: validator.number().positive().moreThan(0).required(),
    sizes: validator
      .array()
      .of(validator.string().mongoId().required())
      .default([])
      .notRequired(),
    colors: validator
      .array()
      .of(
        validator.object({
          name: validator.string().trim().required(),
          value: validator.string().hexColor().required(),
        }),
      )
      .default([])
      .notRequired(),
    category: validator.string().mongoId().required(),
    group: validator.string().notRequired(),
    description: validator.string().trim().notRequired(),
    SKU: validator.string().trim().required(),
    tags: validator
      .array()
      .of(validator.string().trim().required())
      .default([])
      .notRequired(),
    thumbnail: validator.string().url().required(),
    images: validator
      .array()
      .of(validator.string().url().required())
      .default([])
      .notRequired(),
    inStock: validator.boolean().default(true).notRequired(),
    quantity: validator.number().integer().positive().moreThan(0).required(),
    brand: validator.string().notRequired(),
  }),
}

module.exports = {
  productSchema,
}
