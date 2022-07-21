const { ApiController } = require("../../../library/xprevalent")
const filtersRepo = require("../../../repositories/filters.repo")

class ProductsFilterListController extends ApiController {
  async getQueryResult() {
    const { name } = this.req.query
    return filtersRepo.filterProducts(name)
  }

  async handleRequest() {
    try {
      const queryResult = await this.getQueryResult()
      return this.sendResponse({
        body: {
          data: queryResult,
        },
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = ProductsFilterListController
