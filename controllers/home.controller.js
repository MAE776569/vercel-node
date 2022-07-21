const { ApiController } = require("../library/xprevalent")

class HomeController extends ApiController {
  getContextObject() {
    return {
      message: "Welcome to kidzinia",
    }
  }
}

module.exports = HomeController
