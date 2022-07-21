const { ApiController } = require("../../../library/xprevalent")
const filtersRepo = require("../../../repositories/filters.repo")

class FiltersListController extends ApiController {
  async getQueryResult() {
    const sizes = await filtersRepo.getSizes()
    const categories = await filtersRepo.getCategories()
    const collections = await filtersRepo.getCollections()
    const brands = await filtersRepo.getBrands()

    return {
      sizes,
      categories,
      collections,
      brands,
    }
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

module.exports = FiltersListController
