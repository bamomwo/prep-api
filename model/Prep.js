const mongoose = require('mongoose')

const PrepSchema = new mongoose.Schema({
  title: {
    type: 'string',
    maxLength: 70,
    trim: true,
    require: [true, 'Please provide a title'],
    unique: true,
  },

  creator: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    require: true,
  },
  contributors: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  prep: [
    {
      question: {
        type: 'string',
        maxLength: 500,
        required: true,
      },

      options: {
        a: 'string',
        b: 'string',
        c: 'string',
        d: 'string',
        e: 'string',
      },

      correctOption: 'string',

      details: 'string',
    },
  ],
})

const Prep = mongoose.model('Prep', PrepSchema)

module.exports = Prep
