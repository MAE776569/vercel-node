const { ApiController } = require("../../library/xprevalent")
const filtersRepo = require("../../repositories/filters.repo")

class FiltersListController extends ApiController {
  async getQueryResult() {
    const sizes = await filtersRepo.getSizes()
    const categories = await filtersRepo.getCategories()
    const collections = await filtersRepo.getCollections()
    const priceRange = await filtersRepo.getPriceRange()

    const { min: minPrice, max: maxPrice } = priceRange[0]
    return {
      sizes,
      categories,
      collections,
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
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
