const { ApiDeleteController } = require("../../../library/xprevalent")
const brandModel = require("../../../models/brand.model")

class DeleteBrandController extends ApiDeleteController {
  model = brandModel

  getQueryResult() {
    const id = this.req.params[this.idParam]
    return this.model.findByIdAndUpdate(
      id,
      {
        deletedAt: new Date(),
      },
      { new: true },
    )
  }
}

module.exports = DeleteBrandController
