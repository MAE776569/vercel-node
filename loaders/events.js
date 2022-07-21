const logger = require("../utils/logger")

const load = () => {
  require("../events/auth.events")
  require("../events/order.events")
  logger.log("Events started")
}

module.exports = load
