const configModel = require("../models/config.model")

class ConfigRepo {
  getConfigByKey(key) {
    return configModel.findOne({ key })
  }

  getConfigByKeys(keys) {
    return configModel.find({
      key: { $in: keys },
    })
  }
}

module.exports = new ConfigRepo()
