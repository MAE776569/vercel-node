const tokenModel = require("../models/token.model")
const crypto = require("crypto")

class TokensRepo {
  generateUserToken(userId) {
    const token = crypto.randomBytes(32).toString("hex")
    return tokenModel.create({
      user: userId,
      token,
    })
  }

  getUserToken({ userId, token }) {
    return tokenModel.findOne({
      user: userId,
      token,
      expireAt: { $gt: new Date() },
    })
  }

  deleteUserToken(userId) {
    return tokenModel.deleteMany({ user: userId })
  }
}

module.exports = new TokensRepo()
