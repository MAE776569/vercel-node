const mongoose = require("mongoose")

const Testimonial = new mongoose.Schema(
  {
    body: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    visible: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Testimonial", Testimonial)
