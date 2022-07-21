const { events, EVENT_NAMES } = require("./eventEmitter")
const logger = require("../utils/logger")
const tokensRepo = require("../repositories/tokens.repo")
const mailerService = require("../services/mailer.service")

events.on(EVENT_NAMES.USER.REGISTERED, async ({ _id, email, name }) => {
  try {
    const userToken = await tokensRepo.generateUserToken(_id)
    await mailerService.sendEmail({
      to: email,
      subject: "تفعيل الحساب",
      data: {
        user: {
          name,
          email,
        },
        verificationLink:
          process.env.STORE_URL +
          (process.env.STORE_URL.endsWith("/") ? "" : "/") +
          "verify/" +
          userToken.token,
      },
      templatePath: "auth/email-verification.html",
    })
    logger.log("Verification sent successfully")
  } catch (error) {
    logger.error("Error sending verification email")
  }
})

events.on(EVENT_NAMES.USER.ACCOUNT_VERIFIED, async ({ _id, email, name }) => {
  try {
    await tokensRepo.deleteUserToken(_id)
    await mailerService.sendEmail({
      to: email,
      subject: "تم التفعيل بنجاح",
      data: {
        user: {
          name,
          email,
        },
      },
      templatePath: "auth/account-verified.html",
    })
    logger.log("Confirm verification sent successfully")
  } catch (error) {
    logger.error("Error sending confirm verification email")
  }
})
