const productModel = require("../models/product.model")
const userModel = require("../models/user.model")
const { ObjectId } = require("mongoose").Types
const offerModel = require("../models/offer.model")
const { OFFER_TYPES } = require("../helpers/constants")
const sizeModel = require("../models/size.model")

class WishlistRepo {
  addProductsToWishList({ userId, products }) {
    return userModel
      .findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            wishlist: products,
          },
        },
        {
          new: true,
        },
      )
      .select(["name", "email"])
      .populate({
        path: "wishlist",
        select: ["_id", "name", "thumbnail", "price", "inStock"],
      })
      .lean()
  }

  getProductsToRemoveFromWishlist({ userId, productIds }) {
    return userModel
      .findById(userId)
      .select("wishlist")
      .populate({ path: "wishlist", match: { _id: { $in: productIds } } })
      .lean()
  }

  removeProductsFromWishlist({ userId, products }) {
    return userModel
      .findByIdAndUpdate(
        userId,
        {
          $pull: {
            wishlist: { $in: products },
          },
        },
        {
          new: true,
        },
      )
      .select(["name", "email"])
      .populate({
        path: "wishlist",
        select: ["_id", "name", "thumbnail", "price", "inStock"],
      })
      .lean()
  }

  getProductsInWishlist(userId) {
    return userModel.aggregate([
      { $match: { _id: ObjectId(userId) } },
      {
        $project: {
          wishlist: 1,
        },
      },
      {
        $unwind: {
          path: "$wishlist",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: productModel.collection.name,
          localField: "wishlist",
          foreignField: "_id",
          as: "products",
        },
      },
      {
        $unwind: "$products",
      },
      {
        $project: {
          _id: "$products._id",
          name: "$products.name",
          thumbnail: "$products.thumbnail",
          price: "$products.price",
          inStock: "$products.inStock",
          category: "$products.category",
          group: "$products.group",
          sizes: "$products.sizes",
          colors: "$products.colors",
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
          thumbnail: 1,
          inStock: 1,
          sizes: 1,
          colors: 1,
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
          inStock: 1,
          sizes: 1,
          colors: 1,
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

module.exports = new WishlistRepo()
