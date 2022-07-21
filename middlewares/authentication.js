function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated() || req.user?.suspended) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    })
  }
  return next()
}

const authorizeRole = (roleName) => async (req, res, next) => {
  if (req.user?.role?.name !== roleName) {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    })
  }
  return next()
}

const isVerified = (req, res, next) => {
  if (!req.user?.verifiedAt) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    })
  }
  return next()
}

module.exports = {
  isAuthenticated,
  authorizeRole,
  isVerified,
}
