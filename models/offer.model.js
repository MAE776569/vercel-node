const mongoose = require("mongoose")
const { OFFER_TYPES } = require("../helpers/constants")
const DealSchema = require("./schemas/deal.schema")

const Offer = new mongoose.Schema(
  {
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
    deal: DealSchema,
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Offer", Offer)
