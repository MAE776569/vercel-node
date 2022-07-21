const mongoose = require("mongoose")
const { ORDER_STATUS, PAYMENT_METHODS } = require("../helpers/constants")
const AddressSchema = require("./schemas/address.schema")

const OrderItem = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  priceAfterDiscount: {
    type: Number,
    required: false,
  },
  offer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Offer",
    required: false,
  },
  color: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  size: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Size",
    required: false,
  },
})

const Order = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [OrderItem],
      required: true,
    },
    shippingCost: {
      type: Number,
      required: true,
    },
    expectedDeliveryDate: {
      type: Date,
      required: false,
      default: () => Date.now() + 7 * 24 * 60 * 60 * 1000,
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      required: false,
      default: ORDER_STATUS.PENDING,
    },
    notes: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: AddressSchema,
      required: true,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: false,
    },
    couponDiscount: {
      type: Number,
      required: false,
      default: 0,
    },
    actualAmount: {
      type: Number,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: Object.values(PAYMENT_METHODS),
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Order", Order)
