const router = require("express").Router()
const ComparisonListController = require("../controllers/compare/comparison.list.controller")
const AddToComparisonController = require("../controllers/compare/comparison.add.controller")
const RemoveFromComparisonController = require("../controllers/compare/comparison.remove.controller")

router.get("/", ComparisonListController.handle)
router.post("/", AddToComparisonController.handle)
router.post("/delete", RemoveFromComparisonController.handle)

module.exports = router
