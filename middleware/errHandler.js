const ErrorResponse = require('../utils/errorResponse')

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  console.log(err.name)

  let error = {}
  error.message = err.message

  // Incorrect Object Id Error handling
  if (err.name === 'CastError') {
    const message = `Resource with id ${err.value} not found`
    error = new ErrorResponse(message, 404)
  }

  // Duplicate field Error handling
  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = new ErrorResponse(message, 400)
  }

  // Mongoose Validation Error handling
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((err) => err.message)
    error = new ErrorResponse(message, 400)
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, message: error.message || 'Server down' })
}

module.exports = errorHandler
