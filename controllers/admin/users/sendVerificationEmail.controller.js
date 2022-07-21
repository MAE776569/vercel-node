const { ApiController } = require("../../../library/xprevalent")
const { ValidationSchema } = require("../../../library/xprevalent/validators")
const tokensRepo = require("../../../repositories/tokens.repo")
const usersRepo = require("../../../repositories/users.repo")
const mailerService = require("../../../services/mailer.service")
const { userIdSchema } = require("../../../validation/users.schema")

class SendVerificationEmailController extends ApiController {
  validationSchema = new ValidationSchema(userIdSchema)

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

      const { id: userId } = this.req.params
      const user = await usersRepo.getUserById(userId)
      if (!user) {
        return this.sendResponse({
          success: false,
          status: 404,
          message: "User not found",
        })
      }
      if (user.verifiedAt) {
        return this.sendResponse({
          success: false,
          status: 400,
          message: "User already verified",
        })
      }

      const userToken = await tokensRepo.generateUserToken(userId)
      await mailerService.sendEmail({
        to: user.email,
        subject: "تفعيل الحساب",
        data: {
          user: {
            name: user.name,
            email: user.email,
          },
          verificationLink:
            process.env.STORE_URL +
            (process.env.STORE_URL.endsWith("/") ? "" : "/") +
            "verify/" +
            userToken.token,
        },
        templatePath: "auth/email-verification.html",
      })

      return this.sendResponse({
        success: true,
        status: 200,
        message: "Verification email sent successfully",
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = SendVerificationEmailController
