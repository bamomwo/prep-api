const express = require('express')
const router = express.Router()
const {
  createPrep,
  getAllPreps,
  updatePrep,
  deletePrep,
  getPrep,
} = require('../controllers/preps')

const Prep = require('../model/Prep')
const advancedResults = require('../middleware/advancedResults')
const { protect, authorize } = require('../middleware/auth')

router
  .route('/')
  .get(advancedResults(Prep), getAllPreps)
  .post(protect, authorize('admin', 'creator'), createPrep)

router
  .route('/:id')
  .put(protect, authorize('admin'), updatePrep)
  .delete(protect, authorize('admin'), deletePrep)
  .get(getPrep)

module.exports = router
