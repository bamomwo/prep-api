const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const cookieParser = require('cookie-parser')
const preps = require('./routes/preps')
const users = require('./routes/users')
const auth = require('./routes/auth')
const dbConnection = require('./config/dbConnection')
const errorHandler = require('./middleware/errHandler')

// Load environment variables
dotenv.config({ path: 'config/config.env' })

// Database connection
dbConnection()

const app = express()

app.use(express.json())
app.use(cookieParser())

// Mounter routers
app.use('/api/v1/preps', preps)
app.use('/api/v1/users', users)
app.use('/api/v1/auth', auth)

app.use(errorHandler)

console.log(colors.green(''))
const PORT = process.env.PORT || 3000

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${process.env.PORT}`
  )
)

process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`)

  server.close(() => {
    process.exit(1)
  })
})
