const { USER_ROLES } = require("../../../helpers/constants")
const { ApiListController } = require("../../../library/xprevalent")
const userModel = require("../../../models/user.model")
const usersRepo = require("../../../repositories/users.repo")

class CustomersListController extends ApiListController {
  model = userModel
  paginate = true
  sortBy = { createdAt: -1 }

  async getDocumentsCount() {
    const countResult = await usersRepo.countUsers(USER_ROLES.CUSTOMER)
    return countResult[0].total
  }

  getQueryResult() {
    const { page, limit } = this.getPaginationParams()
    const lastPage = this.totalPages
    const currentPage = page > lastPage ? lastPage : page
    return usersRepo.getUsers({
      roleName: USER_ROLES.CUSTOMER,
      sortBy: this.sortBy,
      skip: (currentPage - 1) * limit,
      limit,
    })
  }
}

module.exports = CustomersListController
