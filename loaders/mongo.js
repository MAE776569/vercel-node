const mongoose = require("mongoose")
const logger = require("../utils/logger")

function loadMongoDB() {
  mongoose.connect(process.env.MONGODB_URI)

  mongoose.set("debug", JSON.parse(process.env.MONGO_DEBUG))

  const db = mongoose.connection
  db.on("error", () => {
    logger.error("Error connecting to the database")
    process.exit(1)
  })
  db.once("open", () => {
    logger.log("Connected correctly to the database")
  })
}

module.exports = loadMongoDB
