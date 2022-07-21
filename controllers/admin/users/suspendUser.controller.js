const { ApiEditController } = require("../../../library/xprevalent")
const {
  ValidationSchema,
  validator,
} = require("../../../library/xprevalent/validators")
const usersRepo = require("../../../repositories/users.repo")
const { userIdSchema } = require("../../../validation/users.schema")

class SuspendUserController extends ApiEditController {
  selectedFields = ["_id", "name", "email", "suspended"]

  validationSchema = new ValidationSchema(userIdSchema)

  getQueryResult() {
    const _id = this.req.params[this.idParam]
    return usersRepo
      .updateUser({
        _id,
        data: [{ $set: { suspended: { $eq: [false, "$suspended"] } } }],
      })
      .select(this.selectedFields)
  }
}

module.exports = SuspendUserController
