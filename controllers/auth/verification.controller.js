const { events, EVENT_NAMES } = require("../../events/eventEmitter")
const { ApiController } = require("../../library/xprevalent")
const { ValidationSchema } = require("../../library/xprevalent/validators")
const tokensRepo = require("../../repositories/tokens.repo")
const usersRepo = require("../../repositories/users.repo")
const { accountVerificationSchema } = require("../../validation/auth.schema")

class AccountVerificationController extends ApiController {
  validationSchema = new ValidationSchema(accountVerificationSchema)

  async handleRequest() {
    try {
      const validationResult = this.validationSchema.validate(this.req)
      if (validationResult.hasError()) {
        return this.sendResponse({
          success: false,
          status: 404,
          message: "Not found",
        })
      }

      const userId = this.req.user._id
      const user = await usersRepo.getUserById(userId)
      if (user.verifiedAt) {
        return this.sendResponse({
          success: false,
          status: 422,
          message: "User already verified",
        })
      }

      const { token } = this.req.params
      const userToken = await tokensRepo.getUserToken({ userId, token })
      if (!userToken) {
        return this.sendResponse({
          success: false,
          status: 400,
          message: "Invalid token",
        })
      }

      if (!userToken.user.equals(user._id)) {
        return this.sendResponse({
          success: false,
          status: 422,
          message: "Invalid token",
        })
      }

      await usersRepo.updateUser({
        _id: user._id,
        data: {
          verifiedAt: new Date(),
        },
      })

      events.emit(EVENT_NAMES.USER.ACCOUNT_VERIFIED, user)

      return this.sendResponse({
        success: true,
        message: "Account verified successfully",
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = AccountVerificationController
