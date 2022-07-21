const { ApiCreateController } = require("../../library/xprevalent")
const { ValidationSchema } = require("../../library/xprevalent/validators")
const contactModel = require("../../models/contact.model")
const { createContactSchema } = require("../../validation/contacts.schema")

class CreateContactController extends ApiCreateController {
  model = contactModel
  validationSchema = new ValidationSchema(createContactSchema)
}

module.exports = CreateContactController
