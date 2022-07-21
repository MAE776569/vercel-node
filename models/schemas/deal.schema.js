const mongoose = require("mongoose")

const DealSchema = new mongoose.Schema({
  title: {
    type: String,
    required: false,
  },
  subtitle: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
  redirectTo: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: false,
  },
})

module.exports = DealSchema
