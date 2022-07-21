const { OFFER_TYPES } = require("../helpers/constants")
const couponModel = require("../models/coupon.model")
const { ObjectId } = require("mongoose").Types
const productModel = require("../models/product.model")

class CouponsRepo {
  inquireCoupon({ coupon, products }) {
    return couponModel.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$name", coupon] },
              { $gt: ["$expireAt", new Date()] },
            ],
          },
        },
      },
      {
        $lookup: {
          from: productModel.collection.name,
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", products.map((_id) => ObjectId(_id))],
                },
              },
            },
          ],
          as: "productsMatch",
        },
      },
      {
        $unwind: {
          path: "$productsMatch",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          type: 1,
          value: 1,
          productId: "$productsMatch._id",
          productCategory: "$productsMatch.category",
          productGroup: "$productsMatch.group",
          productBrand: "$productsMatch.brand",
          products: 1,
          categories: 1,
          groups: 1,
        },
      },
      {
        $match: {
          $expr: {
            $or: [
              { $in: ["$productId", "$products"] },
              { $in: ["$productCategory", "$categories"] },
              { $in: ["$productGroup", "$groups"] },
              { $in: ["$productBrand", "$brands"] },
            ],
          },
        },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 1,
          type: 1,
          discount: {
            $cond: {
              if: {
                $eq: ["$type", OFFER_TYPES.AMOUNT],
              },
              then: "$value",
              else: {
                $divide: ["$value", 100],
              },
            },
          },
        },
      },
    ])
  }

  getCouponByName({ name, id }) {
    const filter = { name }
    if (id) {
      filter._id = { $ne: id }
    }
    return couponModel.findOne(filter)
  }

  getCouponById({ couponId, session }) {
    return couponModel.findById(couponId, { session })
  }
}

module.exports = new CouponsRepo()
