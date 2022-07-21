const mongoose = require("mongoose")

const AddressSchema = new mongoose.Schema({
  government: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  apartment: {
    type: String,
    required: false,
  },
  // zipCode: {
  //   type: String,
  //   required: false,
  // },
})

module.exports = AddressSchema
