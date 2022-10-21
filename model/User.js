const mongoose = require('mongoose')

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

  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

const User = mongoose.model('User', UserSchema)
module.exports = User
