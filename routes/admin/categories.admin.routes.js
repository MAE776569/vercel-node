const router = require("express").Router()
const CategoryDetailsController = require("../../controllers/admin/categories/category.details.controller")
const CreateCategoryController = require("../../controllers/admin/categories/category.create.controller")
const CategoriesListController = require("../../controllers/admin/categories/categories.list.controller")
const EditCategoryController = require("../../controllers/admin/categories/category.edit.controller")
const DeleteCategoryController = require("../../controllers/admin/categories/category.delete.controller")

router.get("/", CategoriesListController.handle)
router.get("/:id", CategoryDetailsController.handle)
router.post("/", CreateCategoryController.handle)
router.put("/:id", EditCategoryController.handle)
router.delete("/:id", DeleteCategoryController.handle)

module.exports = router
