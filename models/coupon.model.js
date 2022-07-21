const mongoose = require("mongoose")
const { OFFER_TYPES } = require("../helpers/constants")

const Coupon = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: Object.values(OFFER_TYPES),
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    expireAt: {
      type: Date,
      required: true,
    },
    categories: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Category",
      required: false,
      default: [],
    },
    groups: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Collection",
      required: false,
      default: [],
    },
    brands: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Brand",
      required: false,
      default: [],
    },
    products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
      required: false,
      default: [],
    },
    numberOfUses: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Coupon", Coupon)
