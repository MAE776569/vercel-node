const userModel = require("../models/user.model")
const roleModel = require("../models/role.model")

class UsersRepo {
  updateUser({ _id, data, session }) {
    return userModel.findByIdAndUpdate(_id, data, {
      new: true,
      session: session,
    })
  }

  countUsers(roleName) {
    return userModel.aggregate([
      {
        $project: {
          role: 1,
        },
      },
      {
        $lookup: {
          from: roleModel.collection.name,
          localField: "role",
          foreignField: "_id",
          as: "role",
        },
      },
      {
        $unwind: "$role",
      },
      {
        $match: {
          "role.name": roleName,
        },
      },
      {
        $count: "total",
      },
    ])
  }

  getUsers({ roleName, sortBy, skip, limit }) {
    return userModel.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          suspended: 1,
          role: 1,
          verifiedAt: 1,
        },
      },
      {
        $lookup: {
          from: roleModel.collection.name,
          localField: "role",
          foreignField: "_id",
          as: "role",
        },
      },
      {
        $unwind: "$role",
      },
      {
        $match: {
          "role.name": roleName,
        },
      },
      {
        $sort: sortBy,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          suspended: 1,
          verifiedAt: 1,
        },
      },
    ])
  }

  getUserById(userId) {
    return userModel
      .findById(userId)
      .select(["_id", "role", "name", "email", "suspended", "verifiedAt"])
  }
}

module.exports = new UsersRepo()
