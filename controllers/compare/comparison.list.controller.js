const { ApiListController } = require("../../library/xprevalent")
const productModel = require("../../models/product.model")
const comparisonRepo = require("../../repositories/comparison.repo")

class ComparisonListController extends ApiListController {
  model = productModel

  getQueryResult() {
    const comparisonList = this.req.session.comparisonList || []
    return comparisonRepo.getProductsForComparison(comparisonList)
  }
}

module.exports = ComparisonListController
