const multer = require("multer")
const path = require("path")
const fs = require("fs")
const { v4: uuidv4 } = require("uuid")

function getFolderName(mimetype) {
  if (/^image\//.test(mimetype)) return "images"
  // else if (/^video\//.test(mimetype)) return "videos"
  // else if (/^application\/pdf/.test(mimetype)) return "documents"
}

function fileFilter(req, file, cb) {
  if (
    /^image\//.test(file.mimetype)
    // ||
    // /^video\//.test(file.mimetype) ||
    // /^application\/pdf/.test(file.mimetype)
  )
    return cb(null, true)
  cb(null, false)
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileDir = path.join("./media", getFolderName(file.mimetype))
    if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true })
    cb(null, fileDir)
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.originalname}-${uuidv4()}${path.extname(file.originalname)}`,
    )
  },
})

const saveFile = multer({
  storage: fileStorage,
  fileFilter,
})

module.exports = saveFile.single("file")
