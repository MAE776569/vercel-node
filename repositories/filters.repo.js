const sizeModel = require("../models/size.model")
const categoryModel = require("../models/category.model")
const productModel = require("../models/product.model")
const collectionModel = require("../models/collection.model")
const brandModel = require("../models/brand.model")

class FiltersRepo {
  getSizes() {
    return sizeModel.find()
  }

  getCategories() {
    return categoryModel.find({ deletedAt: { $eq: null } }).select(["name"])
  }

  getPriceRange() {
    return productModel.aggregate([
      {
        $group: {
          _id: null,
          max: { $max: "$price" },
          min: { $min: "$price" },
        },
      },
    ])
  }

  getCollections() {
    return collectionModel.find({ deletedAt: { $eq: null } }).select(["name"])
  }

  getBrands() {
    return brandModel.find({ deletedAt: { $eq: null } }).select("name")
  }

  filterProducts(name) {
    return productModel
      .find({
        name: {
          $regex: name,
          $options: "i",
        },
      })
      .select(["_id", "name"])
  }
}

module.exports = new FiltersRepo()
