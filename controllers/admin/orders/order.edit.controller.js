const { ApiEditController } = require("../../../library/xprevalent")
const { ValidationSchema } = require("../../../library/xprevalent/validators")
const orderModel = require("../../../models/order.model")
const { editOrderSchema } = require("../../../validation/orders.schema")
const ordersRepo = require("../../../repositories/orders.repo")
const { events, EVENT_NAMES } = require("../../../events/eventEmitter")
const { ORDER_STATUS } = require("../../../helpers/constants")

class EditOrderController extends ApiEditController {
  model = orderModel
  validationSchema = new ValidationSchema(editOrderSchema)

  async handleRequest() {
    try {
      if (this.validateIdParam() && !this.updateOne) {
        return this.sendResponse({
          success: false,
          status: 404,
          message: "Invalid id",
        })
      }
      if (this.validationResult.hasError({ location: "body" })) {
        return this.sendResponse({
          success: false,
          status: 422,
          error: this.validationResult.getErrors({ location: "body" }),
        })
      }

      const id = this.req.params[this.idParam]
      const currentOrder = await ordersRepo.getOrderById(id)
      const updateSet = this.getUpdateSet()

      let oldStatusIndex = 0
      let newStatusIndex = 0
      if (currentOrder.status !== updateSet.status) {
        Object.values(ORDER_STATUS).forEach((value, index) => {
          if (currentOrder.status === value) {
            oldStatusIndex = index
          }
          if (updateSet.status === value) {
            newStatusIndex = index
          }
        })
        if (newStatusIndex < oldStatusIndex) {
          return this.sendResponse({
            success: false,
            status: 422,
            message: `Can't update status from ${currentOrder.status} to ${updateSet.status}`,
          })
        }
      }

      const queryResult = await this.getQueryResult()
      if (!queryResult) {
        return this.sendResponse({
          success: false,
          status: 404,
          message: "Not found",
        })
      }
      const contextObject = await this.getContextObject()
      const resObject = Object.assign({}, contextObject)
      resObject[this.queryObjectName] = queryResult

      if (newStatusIndex > oldStatusIndex) {
        events.emit(EVENT_NAMES.ORDER.EMITTED, queryResult._id)
      }

      return this.sendResponse({
        body: resObject,
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = EditOrderController
