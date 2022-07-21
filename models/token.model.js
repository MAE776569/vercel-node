const mongoose = require("mongoose")

const Token = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expireAt: {
      type: Date,
      required: false,
      default: () => Date.now() + Number(process.env.TOKEN_MAX_AGE),
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model("Token", Token)
