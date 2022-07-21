const router = require("express").Router()
const OfferDetailsController = require("../../controllers/admin/offers/offer.details.controller")
const CreateOfferController = require("../../controllers/admin/offers/offer.create.controller")
const OffersListController = require("../../controllers/admin/offers/offers.list.controller")
const EditOfferController = require("../../controllers/admin/offers/offer.edit.controller")

router.get("/", OffersListController.handle)
router.get("/:id", OfferDetailsController.handle)
router.post("/", CreateOfferController.handle)
router.put("/:id", EditOfferController.handle)

module.exports = router
