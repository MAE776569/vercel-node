const ComparisonController = require("./comparison.controller")

class RemoveFromComparisonController extends ComparisonController {
  validateProductsBeforeRemove({ comparisonList, comparisonSet }) {
    const notFoundProducts = comparisonList.filter(
      (_id) => !comparisonSet.has(_id),
    )
    return notFoundProducts
  }

  removeProductsFromComparisonList({ comparisonList, comparisonSet }) {
    return comparisonList.filter((_id) => !comparisonSet.has(_id))
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
      const comparisonList = this.req.session.comparisonList || []
      const comparisonSet = this.constructComparisonSet(products)
      const notFoundProducts = this.validateProductsBeforeRemove({
        comparisonList: products,
        comparisonSet: this.constructComparisonSet(comparisonList),
      })

      if (notFoundProducts.length) {
        return this.sendResponse({
          status: 422,
          message: "Products not found in cart",
          error: {
            products: notFoundProducts,
          },
        })
      }

      const newComparisonList = this.removeProductsFromComparisonList({
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
          message: "Products removed from comparison list successfully",
        })
      })
    } catch (err) {
      return this.next(err)
    }
  }
}

module.exports = RemoveFromComparisonController
