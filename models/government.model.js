const mongoose = require("mongoose")

const Government = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  shippingCost: {
    type: Number,
    required: true,
  },
})

module.exports = mongoose.model("Government", Government)
