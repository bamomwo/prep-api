const asyncHandler = require('../middleware/async')
const User = require('../model/User')

// @desc    Create a user
// @route   POST /api/v1/users
// @access  Public
// eslint-disable-next-line no-unused-vars
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body)
  res.status(200).json({ success: true, data: user })
})

// @desc    Fetch All Users
// @route   GET /api/v1/users
// @access  Private
// eslint-disable-next-line no-unused-vars
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults)
})

// @desc    Fetch A User
// @route   GET /api/v1/users/:id
// @access  Private
// eslint-disable-next-line no-unused-vars
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    return res.status(404).json({
      success: false,
      message: `Resource with id ${req.params.id} not found`,
    })
  }

  res.status(200).json({ success: true, data: user })
})

// @desc  Update User
// @route   PUT /api/v1/users/:id
// @access  Private
// eslint-disable-next-line no-unused-vars
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  })

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: `Update unsuccessful` })
  }
  res.status(400).json({ success: true, data: user })
})

// @desc  Delete  User
// @route   DELETE /api/v1/users/:id
// @access  Private
// eslint-disable-next-line no-unused-vars
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id)

  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: 'Delete unsuccessful' })
  }

  res.status(400).json({ success: true, data: {} })
})
