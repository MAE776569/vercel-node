const createHttpError = require("http-errors")
const { ApiCreateController } = require("../../library/xprevalent")
const { ValidationSchema } = require("../../library/xprevalent/validators")
const reviewModel = require("../../models/review.model")
const productsRepo = require("../../repositories/products.repo")
const { createReviewSchema } = require("../../validation/reviews.schema")

class CreateReviewController extends ApiCreateController {
  model = reviewModel
  validationSchema = new ValidationSchema(createReviewSchema)

  async getQueryResult() {
    const document = this.getDocument()
    const product = await productsRepo.getProductById(document.product)
    if (!product) {
      throw createHttpError(404, "Product not found")
    }
    const review = await super.getQueryResult()
    return review
  }

  getDocument() {
    const document = super.getDocument()
    return {
      ...document,
      user: this.req.user._id,
    }
  }
}

module.exports = CreateReviewController
