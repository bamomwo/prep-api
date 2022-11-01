const express = require('express')

const {
  registerUser,
  login,
  getMe,
  forgotPassword,
  updateDetails,
  resetPassword,
  resetEmail,
  confirmEmailReset,
} = require('../controllers/auth')

const { protect } = require('../middleware/auth')
const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(login)

router.route('/forgotpassword').post(protect, forgotPassword)
router.route('/resetpassword/:resettoken').put(resetPassword)
router.route('/updatedetails').put(protect, updateDetails)
router.route('/resetemail').put(protect, resetEmail)
router
  .route('/confirmemailreset/:emailResetToken')
  .get(protect, confirmEmailReset)
router.route('/me').get(protect, getMe)

module.exports = router
