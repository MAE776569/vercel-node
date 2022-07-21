const mongoose = require("mongoose")

const Category = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
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

module.exports = mongoose.model("Category", Category)
