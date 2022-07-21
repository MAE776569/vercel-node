const productModel = require("../models/product.model")
const categoryModel = require("../models/category.model")
const sizeModel = require("../models/size.model")
const reviewModel = require("../models/review.model")
const { ObjectId } = require("mongoose").Types
const userModel = require("../models/user.model")
const offerModel = require("../models/offer.model")
const { OFFER_TYPES } = require("../helpers/constants")

class ProductsRepo {
  getFeaturedProducts({ type, limit }) {
    const pipeline = [
      { $match: { inStock: true } },
      { $limit: limit },
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
          SKU: 1,
          tags: 1,
          thumbnail: 1,
          images: 1,
          inStock: 1,
          quantity: 1,
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
          SKU: 1,
          tags: 1,
          thumbnail: 1,
          images: 1,
          inStock: 1,
          quantity: 1,
          rating: {
            $ifNull: [{ $avg: "$reviews.rating" }, 0],
          },
          reviewsCount: {
            $size: "$reviews",
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
          description: 1,
          SKU: 1,
          tags: 1,
          thumbnail: 1,
          images: 1,
          inStock: 1,
          quantity: 1,
          rating: 1,
          reviewsCount: 1,
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
          description: 1,
          SKU: 1,
          tags: 1,
          thumbnail: 1,
          images: 1,
          inStock: 1,
          quantity: 1,
          rating: 1,
          reviewsCount: 1,
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
    ]

    if (type === "new") {
      pipeline.unshift({ $sort: { createdAt: -1 } })
    } else if (type === "popular") {
      pipeline.unshift({ $sort: { rating: -1 } })
    }

    return productModel.aggregate(pipeline)
  }

  getProductDetails(productId) {
    return productModel.aggregate([
      { $match: { _id: ObjectId(productId) } },
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
          SKU: 1,
          tags: 1,
          thumbnail: 1,
          images: 1,
          inStock: 1,
          quantity: 1,
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
          SKU: 1,
          tags: 1,
          thumbnail: 1,
          images: 1,
          inStock: 1,
          quantity: 1,
          rating: {
            $ifNull: [{ $avg: "$reviews.rating" }, 0],
          },
          reviewsCount: {
            $size: "$reviews",
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
          description: 1,
          SKU: 1,
          tags: 1,
          thumbnail: 1,
          images: 1,
          inStock: 1,
          quantity: 1,
          rating: 1,
          reviewsCount: 1,
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
          description: 1,
          SKU: 1,
          tags: 1,
          thumbnail: 1,
          images: 1,
          inStock: 1,
          quantity: 1,
          rating: 1,
          reviewsCount: 1,
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

  getProductReviews(productId) {
    return reviewModel.aggregate([
      { $match: { product: ObjectId(productId) } },
      {
        $sort: {
          rating: -1,
          createdAt: -1,
        },
      },
      {
        $lookup: {
          from: userModel.collection.name,
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          rating: 1,
          comment: 1,
          user: {
            name: 1,
            email: 1,
          },
          createdAt: 1,
        },
      },
    ])
  }

  getRelatedProducts({ productId, categoryId }) {
    return productModel.aggregate([
      { $match: { inStock: true, _id: { $ne: ObjectId(productId) } } },
      {
        $lookup: {
          from: categoryModel.collection.name,
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      { $match: { "category._id": ObjectId(categoryId) } },
      { $limit: 4 },
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
          SKU: 1,
          tags: 1,
          thumbnail: 1,
          images: 1,
          inStock: 1,
          quantity: 1,
          rating: {
            $ifNull: [{ $avg: "$reviews.rating" }, 0],
          },
          reviewsCount: {
            $size: "$reviews",
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
          description: 1,
          SKU: 1,
          tags: 1,
          thumbnail: 1,
          images: 1,
          inStock: 1,
          quantity: 1,
          rating: 1,
          reviewsCount: 1,
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
          description: 1,
          SKU: 1,
          tags: 1,
          thumbnail: 1,
          images: 1,
          inStock: 1,
          quantity: 1,
          rating: 1,
          reviewsCount: 1,
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

  getProducts({
    page,
    limit,
    category,
    collection,
    sizes,
    priceRange,
    brand,
    name,
  }) {
    const filter = {
      inStock: true,
    }
    if (category) {
      filter.category = ObjectId(category)
    }
    if (collection) {
      filter.group = ObjectId(collection)
    }
    if (sizes) {
      filter.sizes = { $in: sizes.map((size) => ObjectId(size)) }
    }
    if (priceRange) {
      filter.price = {
        $gte: Number(priceRange[0]),
        $lte: Number(priceRange[1]),
      }
    }
    if (brand) {
      filter.brand = ObjectId(brand)
    }
    if (name) {
      filter.name = {
        $regex: name,
        $options: "i",
      }
    }

    return productModel.aggregate([
      { $match: filter },
      { $skip: (page - 1) * limit },
      { $limit: limit },
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
          SKU: 1,
          tags: 1,
          thumbnail: 1,
          images: 1,
          inStock: 1,
          quantity: 1,
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
          SKU: 1,
          tags: 1,
          thumbnail: 1,
          images: 1,
          inStock: 1,
          quantity: 1,
          rating: {
            $ifNull: [{ $avg: "$reviews.rating" }, 0],
          },
          reviewsCount: {
            $size: "$reviews",
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
          description: 1,
          SKU: 1,
          tags: 1,
          thumbnail: 1,
          images: 1,
          inStock: 1,
          quantity: 1,
          rating: 1,
          reviewsCount: 1,
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
          description: 1,
          SKU: 1,
          tags: 1,
          thumbnail: 1,
          images: 1,
          inStock: 1,
          quantity: 1,
          rating: 1,
          reviewsCount: 1,
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

  getProductById(productId) {
    return productModel.findById(productId)
  }

  getProductsByIds(productIds) {
    return productModel
      .find({
        _id: { $in: productIds },
      })
      .lean()
  }

  updateOneProduct({ _id, data, session }) {
    return productModel.updateOne({ _id }, data, { session: session })
  }

  updateProductById({ _id, data }) {
    return productModel.findByIdAndUpdate(_id, data)
  }
}

module.exports = new ProductsRepo()
