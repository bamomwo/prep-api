const asyncHandler = require('../middleware/async')
const User = require('../model/User')
const ErrorResponse = require('../utils/errorResponse')

// @desc    Register  user
// @route   POST /api/v1/register
// @access  Public
// eslint-disable-next-line no-unused-vars
exports.registerUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body)

  sendTokenResponse(user, 200, res)
})

// @desc    Login a user
// @route   POST /api/v1/login
// @access  Public
// eslint-disable-next-line no-unused-vars
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body

  console.log(email, password)
  // Validate user details
  if (!email || !password) {
    return next(new ErrorResponse(`Please provide credentials`, 400))
  }

  // Check whether user exists
  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    return next(new ErrorResponse(`Invalid Credentials`, 401))
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password)

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid Credentials`, 401))
  }

  sendTokenResponse(user, 200, res)
})

// Fuction to send token response and cookie

const sendTokenResponse = async (user, statusCode, res) => {
  const token = await user.generateToken()

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    HttpOnly: true,
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token })
}

// @desc    User  Profile
// @route   Get /api/v1/auth/me
// @access  Private
// eslint-disable-next-line no-unused-vars
exports.getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: req.user })
})
