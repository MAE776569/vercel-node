const router = require("express").Router()
const InquireCouponController = require("../controllers/coupons/inquireCoupon.controller")

router.post("/inquire", InquireCouponController.handle)

module.exports = router
