const express = require('express')
const router = express.Router()
const {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/users')
const advancedResults = require('../middleware/advancedResults')
const User = require('../model/User')

router.route('/').post(createUser).get(advancedResults(User), getUsers)

router.route('/:id').get(getUser).put(updateUser).delete(deleteUser)

module.exports = router
