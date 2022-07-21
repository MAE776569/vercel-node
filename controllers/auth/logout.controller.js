const { ApiController } = require("../../library/xprevalent")

class LogoutController extends ApiController {
  handleRequest() {
    this.req.logout()
    // this.res.clearCookie("connect.sid")
    return this.sendResponse({ message: "Logged out successfully" })
  }
}

module.exports = LogoutController
