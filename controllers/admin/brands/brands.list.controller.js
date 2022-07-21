const { ApiListController } = require("../../../library/xprevalent")
const brandModel = require("../../../models/brand.model")

class BrandsListController extends ApiListController {
  model = brandModel
  paginate = true
  sortBy = { createdAt: -1 }

  getQueryFilter() {
    return {
      deletedAt: { $eq: null },
    }
  }
}

module.exports = BrandsListController
