const { validator } = require("../library/xprevalent/validators")
const { OFFER_TYPES } = require("../helpers/constants")

const inquireCouponSchema = {
  body: validator.object({
    coupon: validator.string().required(),
    products: validator
      .array()
      .of(validator.string().mongoId())
      .min(1)
      .required(),
  }),
}

const couponSchema = {
  body: validator
    .object({
      name: validator.string().required(),
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
      numberOfUses: validator.number().integer().positive().required(),
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
  inquireCouponSchema,
  couponSchema,
}
