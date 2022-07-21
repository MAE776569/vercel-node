const EventEmitter = require("events")
const events = new EventEmitter()

const EVENT_NAMES = Object.freeze({
  USER: {
    REGISTERED: "registered",
    ACCOUNT_VERIFIED: "account_verified",
  },
  ORDER: {
    EMITTED: "order_emitted",
    CREATED: "new_order",
    UPDATED: "order_updated",
  },
})

module.exports = {
  events,
  EVENT_NAMES,
}
