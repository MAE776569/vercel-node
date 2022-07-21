const mongoose = require("mongoose")

const Config = new mongoose.Schema({
  key: {
    type: String,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
})

module.exports = mongoose.model("Config", Config)
