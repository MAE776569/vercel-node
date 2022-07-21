const mongoose = require("mongoose")
const { SIZE_PERIODS } = require("../helpers/constants")

const Size = new mongoose.Schema(
  {
    interval: {
      type: [Number],
      required: true,
      min: 2,
      max: 2,
    },
    period: {
      type: String,
      enum: SIZE_PERIODS,
      required: true,
    },
  },
  { timestamps: true },
)

Size.index(
  {
    interval: 1,
    period: 1,
  },
  { unique: true },
)

module.exports = mongoose.model("Size", Size)
