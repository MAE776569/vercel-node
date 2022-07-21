require("dotenv").config()
const loadExpress = require("./express")
const loadMongoDB = require("./mongo")
const loadEvents = require("./events")

module.exports = function ({ ExpressApp, HTTPServer }) {
  // loadSockets(HTTPServer)
  loadMongoDB()
  loadExpress(ExpressApp)
  loadEvents()
}
