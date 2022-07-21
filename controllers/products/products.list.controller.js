const { ApiListController } = require("../../library/xprevalent")
const productModel = require("../../models/product.model")
const getSortObject = require("../../helpers/sortBy")
const productsRepo = require("../../repositories/products.repo")

class ProductsListController extends ApiListController {
  model = productModel
  paginate = true

  async getDocumentsCount() {
    const { category, collection, sizes, priceRange, brand, name } =
      this.req.query

    const filter = {
      inStock: true,
    }
    if (category) {
      filter.category = category
    }
    if (collection) {
      filter.group = collection
    }
    if (sizes) {
      filter.sizes = { $in: sizes }
    }
    if (priceRange) {
      filter.price = {
        $gte: Number(priceRange[0]),
        $lte: Number(priceRange[1]),
      }
    }
    if (brand) {
      filter.brand = brand
    }
    if (name) {
      filter.name = {
        $regex: name,
        $options: "i",
      }
    }

    const count = await this.model.countDocuments(filter)
    return count
  }

  async getQueryResult() {
    const { category, collection, sizes, priceRange, brand, name } =
      this.req.query
    // this.sortBy = getSortObject(this.req.query.sortBy)
    const { page, limit } = this.getPaginationParams()
    const products = await productsRepo.getProducts({
      page,
      limit,
      category,
      collection,
      sizes,
      priceRange,
      brand,
      name,
    })

    return products
  }
}

module.exports = ProductsListController
