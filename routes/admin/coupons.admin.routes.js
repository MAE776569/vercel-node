const router = require("express").Router()
const CouponDetailsController = require("../../controllers/admin/coupons/coupon.details.controller")
const CreateCouponController = require("../../controllers/admin/coupons/coupon.create.controller")
const CouponsListController = require("../../controllers/admin/coupons/coupons.list.controller")
const EditCouponController = require("../../controllers/admin/coupons/coupon.edit.controller")

router.get("/", CouponsListController.handle)
router.get("/:id", CouponDetailsController.handle)
router.post("/", CreateCouponController.handle)
router.put("/:id", EditCouponController.handle)

module.exports = router
