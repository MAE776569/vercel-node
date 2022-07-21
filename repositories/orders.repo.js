const productModel = require("../models/product.model")
const { ObjectId } = require("mongoose").Types
const orderModel = require("../models/order.model")
const offerModel = require("../models/offer.model")
const { OFFER_TYPES } = require("../helpers/constants")
const sizeModel = require("../models/size.model")
const userModel = require("../models/user.model")
const couponModel = require("../models/coupon.model")

class OrdersRepo {
  getProductsForOrder(productIds) {
    return productModel.aggregate([
      { $match: { _id: { $in: productIds.map((_id) => ObjectId(_id)) } } },
      {
        $project: {
          _id: 1,
          name: 1,
          price: 1,
          inStock: 1,
          quantity: 1,
          category: 1,
          group: 1,
          brand: 1,
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
          inStock: 1,
          quantity: 1,
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
          inStock: 1,
          quantity: 1,
          offerId: "$offer._id",
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

  createOrder({ order, session }) {
    return orderModel.create([order], { session })
  }

  getUserOrders(userId) {
    return orderModel.aggregate([
      {
        $match: { user: ObjectId(userId) },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          _id: 1,
          items: 1,
          shippingCost: 1,
          status: 1,
          createdAt: 1,
          coupon: 1,
          actualAmount: 1,
          couponDiscount: 1,
          paymentMethod: 1,
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$_id",
          itemsPrice: {
            $sum: {
              $multiply: [
                { $ifNull: ["$items.priceAfterDiscount", "$items.price"] },
                "$items.quantity",
              ],
            },
          },
          shippingCost: { $first: "$shippingCost" },
          status: { $first: "$status" },
          createdAt: { $first: "$createdAt" },
          coupon: { $first: "$coupon" },
          actualAmount: { $first: "$actualAmount" },
          couponDiscount: { $first: "$couponDiscount" },
          paymentMethod: { $first: "$paymentMethod" },
        },
      },
      {
        $lookup: {
          from: couponModel.collection.name,
          localField: "coupon",
          foreignField: "_id",
          as: "coupon",
        },
      },
      {
        $unwind: {
          path: "$coupon",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          totalPrice: { $add: ["$itemsPrice", "$shippingCost"] },
          status: 1,
          createdAt: 1,
          coupon: {
            name: 1,
            value: 1,
            type: 1,
          },
          actualAmount: 1,
          couponDiscount: 1,
          paymentMethod: 1,
        },
      },
      {
        $project: {
          _id: 1,
          totalPrice: {
            $subtract: ["$totalPrice", "$couponDiscount"],
          },
          status: 1,
          createdAt: 1,
          coupon: "$coupon.name",
          actualAmount: 1,
          couponDiscount: 1,
          paymentMethod: 1,
        },
      },
    ])
  }

  getOrderDetails({ userId, orderId }) {
    return orderModel.aggregate([
      {
        $match: { user: ObjectId(userId), _id: ObjectId(orderId) },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: productModel.collection.name,
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          _id: 1,
          quantity: "$items.quantity",
          price: "$items.price",
          priceAfterDiscount: "$items.priceAfterDiscount",
          shippingCost: 1,
          status: 1,
          notes: 1,
          expectedDeliveryDate: 1,
          product: 1,
          colorIndex: {
            $indexOfArray: ["$product.colors._id", "$items.color"],
          },
          size: "$items.size",
          actualAmount: 1,
          couponDiscount: 1,
          paymentMethod: 1,
        },
      },
      {
        $project: {
          _id: 1,
          quantity: 1,
          price: 1,
          priceAfterDiscount: 1,
          shippingCost: 1,
          status: 1,
          notes: 1,
          expectedDeliveryDate: 1,
          product: {
            _id: 1,
            name: 1,
            thumbnail: 1,
          },
          color: {
            $arrayElemAt: ["$product.colors", "$colorIndex"],
          },
          size: 1,
          actualAmount: 1,
          couponDiscount: 1,
          paymentMethod: 1,
        },
      },
      {
        $lookup: {
          from: sizeModel.collection.name,
          localField: "size",
          foreignField: "_id",
          as: "size",
        },
      },
      {
        $unwind: "$size",
      },
      {
        $project: {
          _id: 1,
          shippingCost: 1,
          status: 1,
          notes: 1,
          expectedDeliveryDate: 1,
          product: {
            _id: 1,
            name: 1,
            thumbnail: 1,
            quantity: "$quantity",
            price: "$price",
            priceAfterDiscount: "$priceAfterDiscount",
            color: "$color",
            size: "$size",
          },
          actualAmount: 1,
          couponDiscount: 1,
          paymentMethod: 1,
        },
      },
      {
        $group: {
          _id: {
            _id: "$_id",
            shippingCost: "$shippingCost",
            status: "$status",
            notes: "$notes",
            expectedDeliveryDate: "$expectedDeliveryDate",
            actualAmount: "$actualAmount",
            couponDiscount: "$couponDiscount",
            paymentMethod: "$paymentMethod",
          },
          items: {
            $addToSet: "$product",
          },
        },
      },
      {
        $project: {
          _id: "$_id._id",
          shippingCost: "$_id.shippingCost",
          status: "$_id.status",
          notes: "$_id.notes",
          expectedDeliveryDate: "$_id.expectedDeliveryDate",
          actualAmount: "$_id.actualAmount",
          couponDiscount: "$_id.couponDiscount",
          paymentMethod: "$_id.paymentMethod",
          items: 1,
        },
      },
    ])
  }

  getOrdersForAdmin({ page, limit, sort }) {
    return orderModel.aggregate([
      {
        $sort: sort,
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 1,
          items: 1,
          shippingCost: 1,
          user: 1,
          status: 1,
          notes: 1,
          expectedDeliveryDate: 1,
          createdAt: 1,
          coupon: 1,
          actualAmount: 1,
          couponDiscount: 1,
          paymentMethod: 1,
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$_id",
          itemsPrice: {
            $sum: {
              $multiply: [
                { $ifNull: ["$items.priceAfterDiscount", "$items.price"] },
                "$items.quantity",
              ],
            },
          },
          shippingCost: { $first: "$shippingCost" },
          user: { $first: "$user" },
          status: { $first: "$status" },
          notes: { $first: "$notes" },
          expectedDeliveryDate: { $first: "$expectedDeliveryDate" },
          createdAt: { $first: "$createdAt" },
          coupon: { $first: "$coupon" },
          actualAmount: { $first: "$actualAmount" },
          couponDiscount: { $first: "$couponDiscount" },
          paymentMethod: { $first: "$paymentMethod" },
        },
      },
      {
        $lookup: {
          from: couponModel.collection.name,
          localField: "coupon",
          foreignField: "_id",
          as: "coupon",
        },
      },
      {
        $unwind: {
          path: "$coupon",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          totalPrice: { $add: ["$itemsPrice", "$shippingCost"] },
          user: 1,
          status: 1,
          notes: 1,
          expectedDeliveryDate: 1,
          createdAt: 1,
          coupon: {
            name: 1,
            value: 1,
            type: 1,
          },
          actualAmount: 1,
          couponDiscount: 1,
          paymentMethod: 1,
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
          totalPrice: {
            $subtract: ["$totalPrice", "$couponDiscount"],
          },
          user: {
            email: 1,
            name: 1,
            phone: 1,
            address: 1,
          },
          status: 1,
          notes: 1,
          expectedDeliveryDate: 1,
          createdAt: 1,
          coupon: "$coupon.name",
          actualAmount: 1,
          couponDiscount: 1,
          paymentMethod: 1,
        },
      },
    ])
  }

  getOrderDetailsForAdmin(orderId) {
    return orderModel.aggregate([
      {
        $match: { _id: ObjectId(orderId) },
      },
      {
        $unwind: "$items",
      },
      {
        $lookup: {
          from: productModel.collection.name,
          localField: "items.product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          _id: 1,
          quantity: "$items.quantity",
          price: "$items.price",
          priceAfterDiscount: "$items.priceAfterDiscount",
          shippingCost: 1,
          status: 1,
          notes: 1,
          expectedDeliveryDate: 1,
          product: 1,
          colorIndex: {
            $indexOfArray: ["$product.colors._id", "$items.color"],
          },
          size: "$items.size",
          user: 1,
          coupon: 1,
          actualAmount: 1,
          couponDiscount: 1,
          paymentMethod: 1,
          address: 1,
          createdAt: 1,
        },
      },
      {
        $project: {
          _id: 1,
          quantity: 1,
          price: 1,
          priceAfterDiscount: 1,
          shippingCost: 1,
          status: 1,
          notes: 1,
          expectedDeliveryDate: 1,
          product: {
            _id: 1,
            name: 1,
            thumbnail: 1,
            inStock: 1,
            SKU: 1,
          },
          color: {
            $arrayElemAt: ["$product.colors", "$colorIndex"],
          },
          size: 1,
          user: 1,
          coupon: 1,
          actualAmount: 1,
          couponDiscount: 1,
          paymentMethod: 1,
          address: 1,
          createdAt: 1,
        },
      },
      {
        $lookup: {
          from: sizeModel.collection.name,
          localField: "size",
          foreignField: "_id",
          as: "size",
        },
      },
      {
        $unwind: "$size",
      },
      {
        $project: {
          _id: 1,
          shippingCost: 1,
          status: 1,
          notes: 1,
          expectedDeliveryDate: 1,
          user: 1,
          coupon: 1,
          product: {
            _id: 1,
            name: 1,
            thumbnail: 1,
            quantity: "$quantity",
            price: "$price",
            priceAfterDiscount: "$priceAfterDiscount",
            totalPrice: {
              $multiply: [
                { $ifNull: ["$priceAfterDiscount", "$price"] },
                "$quantity",
              ],
            },
            color: "$color",
            size: "$size",
            inStock: 1,
            SKU: 1,
          },
          actualAmount: 1,
          couponDiscount: 1,
          paymentMethod: 1,
          address: 1,
          createdAt: 1,
        },
      },
      {
        $group: {
          _id: {
            _id: "$_id",
            shippingCost: "$shippingCost",
            status: "$status",
            notes: "$notes",
            expectedDeliveryDate: "$expectedDeliveryDate",
            user: "$user",
            coupon: "$coupon",
            actualAmount: "$actualAmount",
            couponDiscount: "$couponDiscount",
            paymentMethod: "$paymentMethod",
            address: "$address",
            createdAt: "$createdAt",
          },
          items: {
            $addToSet: "$product",
          },
          itemsPrice: {
            $sum: "$product.totalPrice",
          },
        },
      },
      {
        $project: {
          _id: "$_id._id",
          shippingCost: "$_id.shippingCost",
          status: "$_id.status",
          notes: "$_id.notes",
          expectedDeliveryDate: "$_id.expectedDeliveryDate",
          user: "$_id.user",
          coupon: "$_id.coupon",
          actualAmount: "$_id.actualAmount",
          couponDiscount: "$_id.couponDiscount",
          paymentMethod: "$_id.paymentMethod",
          address: "$_id.address",
          createdAt: "$_id.createdAt",
          itemsPrice: "$itemsPrice",
          items: 1,
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
          shippingCost: 1,
          status: 1,
          notes: 1,
          expectedDeliveryDate: 1,
          items: 1,
          coupon: 1,
          itemsPrice: 1,
          totalPrice: { $add: ["$itemsPrice", "$shippingCost"] },
          user: {
            email: 1,
            name: 1,
            phone: 1,
            address: 1,
          },
          actualAmount: 1,
          couponDiscount: 1,
          paymentMethod: 1,
          address: 1,
          createdAt: 1,
        },
      },
      {
        $lookup: {
          from: couponModel.collection.name,
          localField: "coupon",
          foreignField: "_id",
          as: "coupon",
        },
      },
      {
        $unwind: {
          path: "$coupon",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          shippingCost: 1,
          status: 1,
          notes: 1,
          expectedDeliveryDate: 1,
          itemsPrice: 1,
          totalPrice: {
            $subtract: ["$totalPrice", "$couponDiscount"],
          },
          items: 1,
          user: 1,
          coupon: {
            name: 1,
            value: 1,
            type: 1,
          },
          actualAmount: 1,
          couponDiscount: 1,
          paymentMethod: 1,
          address: 1,
          createdAt: 1,
        },
      },
    ])
  }

  getCouponUses({ userId, couponId, session }) {
    return orderModel.countDocuments(
      {
        user: userId,
        coupon: couponId,
      },
      { session },
    )
  }

  getOrderById(orderId) {
    return orderModel.findById(orderId)
  }
}

module.exports = new OrdersRepo()
