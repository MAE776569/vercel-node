const { ApiListController } = require("../../library/xprevalent")
const configModel = require("../../models/config.model")
const formatConfig = require("../../helpers/formatConfig")

class ConfigListController extends ApiListController {
  model = configModel

  async getQueryResult() {
    const configList = await super.getQueryResult()
    const formattedConfig = formatConfig(configList)
    return formattedConfig
  }
}

module.exports = ConfigListController
