const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    lowercase: true,
    maxLength: [10, 'Firstname must be 10 characters'],
    required: [true, 'Firstname is required'],
    trim: true,
  },
  lastname: {
    type: String,
    lowercase: true,
    maxLength: [10, 'Lastname must be 10 characters'],
    required: [true, 'Lastname is required'],
    trim: true,
  },

  email: {
    type: String,
    required: [true, 'Please enter a valid email address'],
    unique: true,
    match: [
      /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
      'Please Enter a valid email',
    ],
  },

  password: {
    type: 'string',
    required: [true, 'Provide a strong password'],
    select: false,
    match: [
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
      'Please provide a strong password',
    ],
  },

  gender: {
    type: 'string',
    required: [true, 'Provide a gender'],
    enum: ['male', 'female', 'other'],
  },

  dob: { type: Date },

  role: {
    type: 'string',
    enum: ['user', 'admin'],
    default: 'user',
  },

  interest: {
    type: ['string'],
    enum: ['tech', 'spelling', 'hacking'],
  },

  stats: {
    preps: [
      {
        prep_id: mongoose.Schema.ObjectId,
        score: 'number',
      },
    ],

    level: 'number',
    nAnsweredPreps: 'number',
    practiceTime: 'number',
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

// Middleware to encrypt password
//eslint-disable-next-line no-unused-vars
UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

// Generate jsonwebtoken
UserSchema.methods.generateToken = async function () {
  return await jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

// Compares password

UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model('User', UserSchema)
module.exports = User
