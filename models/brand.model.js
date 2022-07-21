const mongoose = require("mongoose")

const Brand = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Brand", Brand)
