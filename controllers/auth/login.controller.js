const { ApiController } = require("../../library/xprevalent")
const { loginUserSchema } = require("../../validation/auth.schema")
const passport = require("passport")
const { ValidationSchema } = require("../../library/xprevalent/validators")

class LoginController extends ApiController {
  validationSchema = new ValidationSchema(loginUserSchema)

  async handleRequest() {
    try {
      const validationResult = this.validationSchema.validate(this.req)
      if (validationResult.hasError({ location: "body" })) {
        return this.sendResponse({
          status: 422,
          message: "Error validating user",
          error: validationResult.getErrors({ location: "body" }),
        })
      }

      const authenticator = passport.authenticate("local", (err, user) => {
        if (err) {
          return this.next(err)
        }
        if (!user) {
          return this.sendResponse({
            success: false,
            status: 422,
            message: "Wrong email or password",
          })
        }

        if (user.suspended) {
          return this.sendResponse({
            success: false,
            status: 401,
            message: "Unauthorized",
          })
        }

        this.req.login(user, (err) => {
          if (err) {
            return this.next(err)
          }

          const { email, name } = user
          return this.sendResponse({
            body: {
              user: { email, name },
            },
          })
        })
      })

      authenticator(this.req, this.res, this.next)
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = LoginController
