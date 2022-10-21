const express = require('express')
const router = express.Router()
const {
  createPrep,
  getAllPreps,
  updatePrep,
  deletePrep,
  getPrep,
} = require('../controllers/preps')

router.route('/').get(getAllPreps).post(createPrep)

router.route('/:id').put(updatePrep).delete(deletePrep).get(getPrep)

module.exports = router
