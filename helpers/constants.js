const SIZE_PERIODS = ["شهر", "شهور", "سنة", "سنين"]

const OFFER_TYPES = Object.freeze({
  PERCENT: "percent",
  AMOUNT: "amount",
})

const ORDER_STATUS = Object.freeze({
  PENDING: "جاري التحضير",
  IN_PROGRESS: "جاري التوصيل",
  FULFILLED: "تم الإستلام",
  CANCELLED: "تم الرفض",
})

const USER_ROLES = Object.freeze({
  ADMIN: "admin",
  CUSTOMER: "customer",
})

const PAYMENT_METHODS = Object.freeze({
  CASH: "cash",
})

const EMAIL_PROVIDERS = ["gmail", "outlook", "yahoo"]

module.exports = {
  OFFER_TYPES,
  SIZE_PERIODS,
  ORDER_STATUS,
  USER_ROLES,
  PAYMENT_METHODS,
  EMAIL_PROVIDERS,
}
