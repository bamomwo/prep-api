const crypto = require('crypto')
const asyncHandler = require('../middleware/async')
const User = require('../model/User')
const ErrorResponse = require('../utils/errorResponse')
const sendMail = require('../utils/sendMail')

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

// @desc    User  Profile
// @route   Get /api/v1/auth/me
// @access  Private
// eslint-disable-next-line no-unused-vars
exports.getMe = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: req.user })
})

// @desc    Forgot Password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
// eslint-disable-next-line no-unused-vars
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body

  // Check if email is provided
  if (!email) {
    next(new ErrorResponse('Please provide your account email address', 400))
  }
  const user = await User.findOne({ email })

  if (!user) {
    next(new ErrorResponse(`No account with found with ${email}`, 404))
  }

  const resetToken = user.generatePasswordResetToken()

  await user.save({ validateBeforeSave: false })

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetpassword/${resetToken}`

  const message = `Use this link to reset your password ${resetUrl}`

  try {
    await sendMail({
      email: email,
      subject: 'Password Reset',
      text: message,
    })

    res.status(200).json({ success: true, message: 'Email sent' })
  } catch (error) {
    console.error(error)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    next(new ErrorResponse(`Email not sent`, 500))
  }
})

// @desc    Update User Details
// @route   PUT /api/v1/auth/updatedetails
// @access  Private
// eslint-disable-next-line no-unused-vars
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const updateData = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    gender: req.body.gender,
    dob: req.body.dob,
  }

  const user = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, data: user })
})

// @desc    Reset Password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
// eslint-disable-next-line no-unused-vars
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    next(new ErrorResponse('Invalid Token', 400))
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  await user.save()
  sendTokenResponse(user, 200, res)
})

// @desc    Change Email
// @route   PUT /api/v1/auth/resetemail
// @access  Private
// eslint-disable-next-line no-unused-vars
exports.resetEmail = asyncHandler(async (req, res, next) => {
  // Check if email is provided

  if (!req.body.email) {
    next(new ErrorResponse(`Please new email address `, 400))
  }

  const user = req.user
  user.resetEmail = req.body.email

  // generate a token and send to new email email
  const emailResetToken = user.generatePasswordResetToken()
  const message = `Use this link to change your email ${
    req.protocol
  }://${req.get('host')}/api/v1/auth/resetemail/${emailResetToken}`

  await user.save({ validateBeforeSave: false })

  try {
    sendMail({
      email: req.body.email,
      subject: 'Email Verification',
      text: message,
    })

    res.status(200).json({ success: true, message: 'Verification mail sent. ' })
  } catch (error) {
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    user.save({ validateBeforeSave: false })
  }
})

// @desc    Change Email
// @route   PUT /api/v1/auth/resetemail
// @access  Private
// eslint-disable-next-line no-unused-vars
exports.confirmEmailReset = asyncHandler(async (req, res, next) => {
  // Hash token

  const hashEmailResetToken = crypto
    .createHash('sha256')
    .update(req.params.emailResetToken)
    .digest('hex')

  // Find user with hashed token and expiration
  const user = await User.findOne({
    resetPasswordToken: hashEmailResetToken,
    resetPasswordExpire: { $gt: Date.now() },
  })

  if (!user) {
    return next(new ErrorResponse(`Invalid Token`, 400))
  }

  user.email = user.resetEmail
  await user.save({ validateBeforeSave: false })

  res.status(200).json({ success: true, message: 'Email Changed' })
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
