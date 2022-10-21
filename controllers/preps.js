const Prep = require('../model/Prep')
const asyncHandler = require('../middleware/async')

//@desc             Creates a Prep
//@Route            POST /api/v1/prep
//@access           Private
//eslint-disable-next-line no-unused-vars
exports.createPrep = asyncHandler(async (req, res, next) => {
  const prep = await Prep.create(req.body)

  res.json({ success: true, data: prep })
})

//@desc             Get all Prebs
//@Route            GET /api/v1/prep
//@access           Public
//eslint-disable-next-line no-unused-vars
exports.getAllPreps = asyncHandler(async (req, res, next) => {
  const preps = await Prep.find(req.query)
    .populate({
      path: 'creator',
      select: 'firstname lastname email',
    })
    .populate({ path: 'contributors', select: 'firstname lastname email' })
  res.status(200).json({ success: true, count: preps.length, data: preps })
})

//@desc             Get a Preb
//@Route            GET /api/v1/preb/:id
//@access           Public
//eslint-disable-next-line no-unused-vars
exports.getPrep = asyncHandler(async (req, res, next) => {
  const prep = await Prep.findById(req.params.id)
  if (!prep) {
    return res.status(404).json({
      success: false,
      message: `Resource with id ${req.params.id} not found`,
    })
  }

  res.json({
    success: true,
    data: prep,
  })
})

//@desc             Update a Prep
//@Route            PUT  /api/v1/preps/:id
//@access           Private
//eslint-disable-next-line no-unused-vars
exports.updatePrep = asyncHandler(async (req, res, next) => {
  const prep = await Prep.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!prep) {
    return res.status(404).json({
      success: false,
      message: `Resource with id ${req.params.id} not found`,
    })
  }

  res.json({
    success: true,
    data: prep,
  })
})

//@desc             Delete a Prep
//@Route            DELETE /api/v1/preps/:id
//@access           Private
//eslint-disable-next-line no-unused-vars
exports.deletePrep = asyncHandler(async (req, res, next) => {
  const prep = await Prep.findByIdAndDelete(req.params.id)

  if (!prep) {
    return res.status(404).json({
      success: false,
      message: `Resource with id ${req.params.id} not found`,
    })
  }

  res.json({
    success: true,
    data: {},
  })
})
