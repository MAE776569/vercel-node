const router = require("express").Router()
const CollectionDetailsController = require("../../controllers/admin/collections/collection.details.controller")
const CreateCollectionController = require("../../controllers/admin/collections/collection.create.controller")
const CollectionsListController = require("../../controllers/admin/collections/collections.list.controller")
const EditCollectionController = require("../../controllers/admin/collections/collection.edit.controller")
const DeleteCollectionController = require("../../controllers/admin/collections/collection.delete.controller")

router.get("/", CollectionsListController.handle)
router.get("/:id", CollectionDetailsController.handle)
router.post("/", CreateCollectionController.handle)
router.put("/:id", EditCollectionController.handle)
router.delete("/:id", DeleteCollectionController.handle)

module.exports = router
