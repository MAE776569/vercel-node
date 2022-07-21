const mongoose = require("mongoose")

const Collection = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subtitle: {
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
  { timestamps: true },
)

module.exports = mongoose.model("Collection", Collection)
