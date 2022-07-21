const roleModel = require("../models/role.model")

class RolesRepo {
  getRoleById(id) {
    return roleModel.findById(id)
  }

  getRoleByName(name) {
    return roleModel.findOne({ name })
  }
}

module.exports = new RolesRepo()
