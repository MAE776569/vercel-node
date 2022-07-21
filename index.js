const loaders = require("./loaders/index")
// const fs = require("fs")
const express = require("express")
const app = express()
const logger = require("./utils/logger")

let httpsOptions
// if (process.env.PROTOCOL && process.env.PROTOCOL == "https") {
//   httpsOptions = {
//     key: fs.readFileSync(process.env.KEY_PATH),
//     cert: fs.readFileSync(process.env.CERTIFICATE_PATH),
//   }
// }

let server
if (httpsOptions) {
  const https = require("https")
  server = https.createServer(httpsOptions, app)
} else {
  const http = require("http")
  server = http.createServer(app)
}

// invoke loaders
loaders({
  ExpressApp: app,
  HTTPServer: server,
})

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== "listen") {
    throw error
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      logger.error(bind + " requires elevated privileges")
      process.exit(1)
      break
    case "EADDRINUSE":
      logger.error(bind + " is already in use")
      process.exit(1)
      break
    default:
      throw error
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address()
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port

  // signals.emit("app:start", bind)
  logger.log(`Listening on ${bind}`)
}

// Listen on provided port, on all network interfaces.
const port = normalizePort(process.env.PORT || 3000)
server.listen(port)
server.on("error", onError)
server.on("listening", onListening)
