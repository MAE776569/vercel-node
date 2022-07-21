const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")
const AddressSchema = require("./schemas/address.schema")

const User = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    wishlist: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      ],
      default: [],
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: AddressSchema,
      required: false,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    suspended: {
      type: Boolean,
      required: false,
      default: false,
    },
    verifiedAt: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true },
)

User.plugin(passportLocalMongoose, { usernameField: "email" })

module.exports = mongoose.model("User", User)
