const { ApiCreateController } = require("../../library/xprevalent")
const userModel = require("../../models/user.model")
const { signupUserSchema } = require("../../validation/auth.schema")
const createHttpError = require("http-errors")
const { ValidationSchema } = require("../../library/xprevalent/validators")
const rolesRepo = require("../../repositories/roles.repo")
const { USER_ROLES } = require("../../helpers/constants")
const { events, EVENT_NAMES } = require("../../events/eventEmitter")

class SignupUserController extends ApiCreateController {
  model = userModel
  validationSchema = new ValidationSchema(signupUserSchema)

  async handleRequest() {
    if (this.validationResult.hasError({ location: "body" })) {
      return this.sendResponse({
        status: 422,
        error: this.validationResult.getErrors({ location: "body" }),
      })
    }

    const role = await rolesRepo.getRoleByName(USER_ROLES.CUSTOMER)

    const { email, password, name } = this.getDocument()
    this.model.register(
      new this.model({ email, name, role: role._id }),
      password,
      (err, user) => {
        if (err) {
          return this.next(
            createHttpError.UnprocessableEntity("User already exists"),
          )
        }

        this.req.login(user, (err) => {
          if (err) {
            return this.next(err)
          }

          const { email: userEmail, name: userName, _id } = user
          events.emit(EVENT_NAMES.USER.REGISTERED, { _id, email, name })
          return this.sendResponse({
            body: {
              user: { email: userEmail, name: userName },
            },
          })
        })
      },
    )
  }
}

module.exports = SignupUserController
