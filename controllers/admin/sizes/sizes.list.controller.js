const { ApiListController } = require("../../../library/xprevalent")
const sizeModel = require("../../../models/size.model")

class SizesListController extends ApiListController {
  model = sizeModel
  paginate = true
  sortBy = { createdAt: -1 }
}

module.exports = SizesListController
