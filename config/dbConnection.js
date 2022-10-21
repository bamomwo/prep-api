const mongoose = require('mongoose')

const dbConnection = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
  })
  console.log(`MongoDB connected on:${conn.connection.host}`.bold.yellow)
}

module.exports = dbConnection
