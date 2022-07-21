const ComparisonController = require("./comparison.controller")

class AddToComparisonController extends ComparisonController {
  validateProductsBeforeAdd({ comparisonSet, productsList }) {
    if (!productsList.length) {
      return [...comparisonSet]
    }

    const notFoundProducts = productsList
      .map(({ _id }) => _id)
      .filter((_id) => !comparisonSet.has(_id.toString()))
    return notFoundProducts
  }

  addProductsForComparison({ products, comparisonList, comparisonSet }) {
    products.forEach((productId) => {
      if (!comparisonSet.has(productId)) {
        comparisonList.push(productId)
      }
    })

    return comparisonList
  }

  async handleRequest() {
    try {
      const validationResult = this.validationSchema.validate(this.req)
      if (validationResult.hasError({ location: "body" })) {
        return this.sendResponse({
          status: 422,
          error: validationResult.getErrors({ location: "body" }),
        })
      }

      const { products } = validationResult.getValue("body")
      const productsFromDb = await this.getProducts(products)
      const notFoundProducts = this.validateProductsBeforeAdd({
        comparisonSet: this.constructComparisonSet(products),
        productsList: productsFromDb,
      })

      if (notFoundProducts.length) {
        return this.sendResponse({
          status: 422,
          message: "Products not found",
          error: {
            products: notFoundProducts,
          },
        })
      }

      const comparisonList = this.req.session.comparisonList || []
      const comparisonSet = this.constructComparisonSet(comparisonList)
      const newComparisonList = this.addProductsForComparison({
        products,
        comparisonList,
        comparisonSet,
      })

      this.req.session.comparisonList = newComparisonList
      this.req.session.save((err) => {
        if (err) {
          return this.next(err)
        }

        return this.sendResponse({
          body: {
            data: this.req.session.comparisonList,
          },
          message: "Products added for comparison successfully",
        })
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = AddToComparisonController
