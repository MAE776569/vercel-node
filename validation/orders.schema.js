const { ORDER_STATUS, PAYMENT_METHODS } = require("../helpers/constants")
const { validator } = require("../library/xprevalent/validators")

const createOrderSchema = {
  body: validator.object({
    government: validator.string().required(),
    city: validator.string().required(),
    street: validator.string().required(),
    phone: validator
      .string()
      .length(11)
      .matches(/\d{11}/)
      .required(),
    apartment: validator.string().notRequired(),
    // zipCode: validator.string().notRequired(),
    notes: validator.string().notRequired(),
    saveAddress: validator.boolean().notRequired(),
    coupon: validator.string().mongoId().notRequired(),
    shippingCost: validator.number().positive().required(),
    couponDiscount: validator.number().positive().notRequired(),
    paymentMethod: validator
      .string()
      .oneOf(Object.values(PAYMENT_METHODS))
      .notRequired()
      .default(PAYMENT_METHODS.CASH),
  }),
}

const editOrderSchema = {
  body: validator.object({
    status: validator.string().oneOf(Object.values(ORDER_STATUS)).required(),
    shippingCost: validator.number().positive().required(),
    expectedDeliveryDate: validator.date().required(),
    actualAmount: validator.number().positive().notRequired(),
    couponDiscount: validator.number().notRequired().default(0),
  }),
}

module.exports = {
  createOrderSchema,
  editOrderSchema,
}
