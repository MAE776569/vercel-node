const LatestDealController = require("../controllers/deals/deals.latest.controller")

const router = require("express").Router()

router.get("/latest", LatestDealController.handle)

module.exports = router
