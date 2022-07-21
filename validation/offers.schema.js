const { validator } = require("../library/xprevalent/validators")
const { OFFER_TYPES } = require("../helpers/constants")

const offerSchema = {
  body: validator
    .object({
      type: validator.string().oneOf(Object.values(OFFER_TYPES)).required(),
      value: validator.number().positive().min(1).required(),
      expireAt: validator.date().required(),
      categories: validator
        .array()
        .of(validator.string().required())
        .notRequired()
        .default([]),
      groups: validator
        .array()
        .of(validator.string().required())
        .notRequired()
        .default([]),
      brands: validator
        .array()
        .of(validator.string().required())
        .notRequired()
        .default([]),
      products: validator
        .array()
        .of(validator.string().required())
        .notRequired()
        .default([]),
      deal: validator
        .object({
          title: validator.string().trim().required(),
          subtitle: validator.string().trim().required(),
          images: validator
            .array()
            .of(validator.string().url().required())
            .notRequired(),
          redirectTo: validator.string().trim().required(),
          isActive: validator.boolean().notRequired().default(true),
        })
        .notRequired()
        .default(undefined),
    })
    .test(
      "AtLeastOne",
      "at least one required",
      ({ categories, groups, brands, products }) => {
        return (
          (Array.isArray(categories) && categories.length) ||
          (Array.isArray(groups) && groups.length) ||
          (Array.isArray(brands) && brands.length) ||
          (Array.isArray(products) && products.length)
        )
      },
    ),
}

module.exports = {
  offerSchema,
}
