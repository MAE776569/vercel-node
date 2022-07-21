const router = require("express").Router()
const BrandDetailsController = require("../../controllers/admin/brands/brand.details.controller")
const CreateBrandController = require("../../controllers/admin/brands/brand.create.controller")
const BrandsListController = require("../../controllers/admin/brands/brands.list.controller")
const EditBrandController = require("../../controllers/admin/brands/brand.edit.controller")
const DeleteBrandController = require("../../controllers/admin/brands/brand.delete.controller")

router.get("/", BrandsListController.handle)
router.get("/:id", BrandDetailsController.handle)
router.post("/", CreateBrandController.handle)
router.put("/:id", EditBrandController.handle)
router.delete("/:id", DeleteBrandController.handle)

module.exports = router
