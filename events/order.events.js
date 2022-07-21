const { events, EVENT_NAMES } = require("./eventEmitter")
const logger = require("../utils/logger")
const mailerService = require("../services/mailer.service")
const ordersRepo = require("../repositories/orders.repo")
const { ORDER_STATUS } = require("../helpers/constants")

function getOrderStatusText(orderStatus) {
  let text = ""
  if (orderStatus === ORDER_STATUS.PENDING) {
    text = "جاري تحضير الطلب"
  } else if (orderStatus === ORDER_STATUS.IN_PROGRESS) {
    text = "جاري  توصيل الطلب"
  } else if (orderStatus === ORDER_STATUS.FULFILLED) {
    text = "تم التوصيل بنجاح"
  } else if (orderStatus === ORDER_STATUS.CANCELLED) {
    text = "تم رفض الطلب"
  }
  return text
}

events.on(EVENT_NAMES.ORDER.EMITTED, async (orderId) => {
  try {
    const queryResult = await ordersRepo.getOrderDetailsForAdmin(orderId)
    const order = queryResult[0]
    const orderStatusText = getOrderStatusText(order.status)
    await mailerService.sendEmail({
      to: order.user.email,
      subject: orderStatusText,
      data: {
        order,
        orderStatusText,
      },
      templatePath: "orders/order-details.html",
    })
    logger.log("Order email sent successfully")
  } catch (error) {
    logger.error("Error sending order email")
  }
})
