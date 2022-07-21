const productModel = require("../models/product.model")
const { ObjectId } = require("mongoose").Types
const categoryModel = require("../models/category.model")
const sizeModel = require("../models/size.model")
const reviewModel = require("../models/review.model")
const offerModel = require("../models/offer.model")
const { OFFER_TYPES } = require("../helpers/constants")

class ComparisonRepo {
  getProductsForComparison(comparisonList) {
    return productModel.aggregate([
      { $match: { _id: { $in: comparisonList.map((_id) => ObjectId(_id)) } } },
      {
        $lookup: {
          from: categoryModel.collection.name,
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          sizes: 1,
          colors: 1,
          category: 1,
          group: 1,
          description: 1,
          thumbnail: 1,
          inStock: 1,
          quantity: 1,
          brand: 1,
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: sizeModel.collection.name,
          localField: "sizes",
          foreignField: "_id",
          as: "sizes",
        },
      },
      {
        $lookup: {
          from: reviewModel.collection.name,
          localField: "_id",
          foreignField: "product",
          as: "reviews",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          sizes: 1,
          colors: 1,
          category: 1,
          group: 1,
          description: 1,
          thumbnail: 1,
          inStock: 1,
          quantity: 1,
          brand: 1,
          rating: {
            $ifNull: [{ $avg: "$reviews.rating" }, 0],
          },
        },
      },
      {
        $lookup: {
          from: offerModel.collection.name,
          let: {
            productId: "$_id",
            categoryId: "$category._id",
            groupId: "$group",
            brandId: "$brand",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $or: [
                        { $in: ["$$productId", "$products"] },
                        { $in: ["$$categoryId", "$categories"] },
                        { $in: ["$$groupId", "$groups"] },
                        { $in: ["$$brandId", "$brands"] },
                      ],
                    },
                    { $gt: ["$expireAt", new Date()] },
                  ],
                },
              },
            },
            { $sort: { createdAt: -1 } },
          ],
          as: "offers",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          sizes: 1,
          colors: 1,
          category: 1,
          group: 1,
          brand: 1,
          description: 1,
          thumbnail: 1,
          inStock: 1,
          quantity: 1,
          rating: 1,
          offer: {
            $arrayElemAt: ["$offers", 0],
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          sizes: 1,
          colors: 1,
          category: 1,
          group: 1,
          brand: 1,
          description: 1,
          thumbnail: 1,
          inStock: 1,
          quantity: 1,
          rating: 1,
          priceAfterDiscount: {
            $cond: {
              if: {
                $eq: ["$offer.type", OFFER_TYPES.AMOUNT],
              },
              then: {
                $subtract: ["$price", "$offer.value"],
              },
              else: {
                $multiply: [
                  "$price",
                  { $subtract: [1, { $divide: ["$offer.value", 100] }] },
                ],
              },
            },
          },
        },
      },
    ])
  }
}

module.exports = new ComparisonRepo()
