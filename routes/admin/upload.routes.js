const router = require("express").Router()
const saveFile = require("../../middlewares/multer")

router.post("/", saveFile, async (req, res, next) => {
  const { file } = req
  if (!file) {
    return res.status(422).json({
      success: false,
      error: { file: "No file is selected" },
    })
  }

  return res.json({
    success: true,
    path:
      (process.env.DOMAIN + process.env.DOMAIN.endsWith("/") ? "" : "/") +
      req.file.path,
  })
})

module.exports = router
