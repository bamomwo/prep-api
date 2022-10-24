const fs = require('fs')
const mongoose = require('mongoose')
const User = require('./model/User')
// const Prep = require('./model/Prep')
const dotenv = require('dotenv')

// Load Environment variables
dotenv.config({ path: './config/config.env' })

// Create db connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
})

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8')
)

// const preps = JSON.parse(
//   fs.readFileSync(`${__dirname}/data/preps.json`, 'utf-8')
// )
// Import all users
const importData = async () => {
  try {
    await User.create(users)
    // await Prep.create(preps)
    console.log('Data Imported')
    process.exit(0)
  } catch (err) {
    console.log(err)
  }
}

const destroyData = async () => {
  try {
    await User.deleteMany({})
    // await Prep.deleteMany({})
    console.log('Data Deleted')
    process.exit(0)
  } catch (err) {
    console.log(err)
  }
}

if (process.argv[2] === '-import') {
  importData()
} else if (process.argv[2] === '-delete') {
  destroyData()
}
