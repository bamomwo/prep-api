const advancedResults = (model) => async (req, res, next) => {
  let query
  let reqQuery = { ...req.query }

  const removeFields = ['select', 'sort', 'page', 'limit']
  removeFields.forEach((field) => delete reqQuery[field])

  let queryStr = JSON.stringify(reqQuery)

  queryStr = JSON.parse(
    queryStr.replace(/\b(gt|gte|lte|lt|in)\b/g, (match) => `$${match}`)
  )

  query = model.find(queryStr).setOptions({ strictQuery: false })

  // Select functionality
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ')
    query.select(fields)
  }

  // Sort functionality
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query.sort(sortBy)
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await model.countDocuments()

  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  const result = await query

  res.advancedResults = {
    success: true,
    count: result.length,
    pagination,
    data: result,
  }

  next()
}

module.exports = advancedResults
