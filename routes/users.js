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
const { protect, authorize } = require('../middleware/auth')

router.use(protect)
router.use(authorize('admin'))

router.route('/').get(advancedResults(User), getUsers)

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

module.exports = router
