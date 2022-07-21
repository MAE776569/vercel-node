const productModel = require("../models/product.model")
const offerModel = require("../models/offer.model")
const { OFFER_TYPES } = require("../helpers/constants")
const { ObjectId } = require("mongoose").Types
const sizeModel = require("../models/size.model")

class CartRepo {
  getCartProducts({ productIds, inStock }) {
    const filter = {
      _id: {
        $in: productIds.map((_id) => ObjectId(_id)),
      },
    }

    if (typeof inStock === true) {
      filter.inStock = inStock
    }

    return productModel.aggregate([
      {
        $match: filter,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          thumbnail: 1,
          quantity: 1,
          category: 1,
          group: 1,
          colors: 1,
          sizes: 1,
          brand: 1,
        },
      },
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
          from: offerModel.collection.name,
          let: {
            productId: "$_id",
            categoryId: "$category",
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
          thumbnail: 1,
          quantity: 1,
          colors: 1,
          sizes: 1,
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
          thumbnail: 1,
          quantity: 1,
          colors: 1,
          sizes: 1,
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

module.exports = new CartRepo()
