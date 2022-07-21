module.exports = (sortBy) => {
  let sortByObject

  if (sortBy?.length) {
    const sortByString = sortBy.split(/([(,)])/)
    sortByObject = { [sortByString[2]]: sortByString[0] === "desc" ? -1 : 1 }
  }

  return sortByObject
}
