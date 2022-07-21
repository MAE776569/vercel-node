const { ApiDeleteController } = require("../../../library/xprevalent")
const collectionModel = require("../../../models/collection.model")

class DeleteCollectionController extends ApiDeleteController {
  model = collectionModel

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

module.exports = DeleteCollectionController
