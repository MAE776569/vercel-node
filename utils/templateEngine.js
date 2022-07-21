const Handlebars = require("handlebars")
const fs = require("fs").promises
const path = require("path")
const configRepo = require("../repositories/config.repo")
const formatConfig = require("../helpers/formatConfig")

class TemplateEngine {
  constructor() {
    this.engine = Handlebars
    this.templatesDir = "../templates"
    this.registerHelpers()
  }

  registerHelpers() {
    this.engine.registerHelper("concat", (...args) => {
      args.pop()
      return args.map((value) => value.toString()).join("")
    })

    this.engine.registerHelper("formatDate", (date) => {
      const dateOptions = { year: "numeric", month: "short", day: "numeric" }
      return new Date(date).toLocaleDateString("ar-EG", dateOptions)
    })
  }

  async getTemplate(templatePath) {
    const filePath = path.join(__dirname, this.templatesDir, templatePath)
    const buffer = await fs.readFile(filePath)
    const fileContent = buffer.toString()
    return fileContent
  }

  async setData(data = {}) {
    const imagesPath = path.join(__dirname, "../public", "/images")
    const imagesList = await fs.readdir(imagesPath)

    const imagesLinks = {}
    imagesList.forEach((image) => {
      const { name } = path.parse(image)
      imagesLinks[name] =
        process.env.DOMAIN +
        (process.env.DOMAIN.endsWith("/") ? "" : "/") +
        `public/images/${image}`
    })

    const config = await configRepo.getConfigByKeys([
      "logo",
      "socialLinks",
      "phone",
      "email",
      "address",
    ])
    const formattedConfig = formatConfig(config)

    this.data = {
      ...data,
      images: imagesLinks,
      links: {
        shop:
          process.env.DOMAIN +
          (process.env.DOMAIN.endsWith("/") ? "" : "/") +
          "shop",
      },
      year: new Date().getFullYear(),
      ...formattedConfig,
      domain: process.env.DOMAIN + process.env.DOMAIN.endsWith("/") ? "" : "/",
      store:
        process.env.STORE_URL +
        (process.env.STORE_URL.endsWith("/") ? "" : "/"),
    }
  }

  async compile({ templatePath, data }) {
    const html = await this.getTemplate(templatePath)
    await this.setData(data)
    const template = Handlebars.compile(html)
    return template(this.data, {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    })
  }
}

module.exports = new TemplateEngine()
