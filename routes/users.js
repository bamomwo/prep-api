const express = require('express')
const router = express.Router()
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/users')
const advancedResults = require('../middleware/advancedResults')
const User = require('../model/User')
const { protect } = require('../middleware/auth')

router.route('/').get(advancedResults(User), getUsers)

router
  .route('/:id')
  .get(getUser)
  .put(protect, updateUser)
  .delete(protect, deleteUser)

module.exports = router
