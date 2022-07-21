const { ApiListController } = require("../../../library/xprevalent")
const contactModel = require("../../../models/contact.model")

class ContactsListController extends ApiListController {
  model = contactModel
  paginate = true
  sortBy = { createdAt: -1 }
}

module.exports = ContactsListController
