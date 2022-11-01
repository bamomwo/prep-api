const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const jwt = require('jsonwebtoken')
const User = require('../model/User')

// Middleware to protect routes from unauthorized requests
exports.protect = asyncHandler(async (req, res, next) => {
  // Check if request is sent with token
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  try {
    const decoded = jwt.decode(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
  } catch (error) {
    next(new ErrorResponse(`Unauthorized access to this route`))
  }
  next()
})

// Access control middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} not authorize to access this route`
        )
      )
    }
    next()
  }
}
