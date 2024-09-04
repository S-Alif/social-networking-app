const express = require('express')
const cors = require('cors')
const hpp = require('hpp')
//const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const { default: mongoose } = require('mongoose')
require('dotenv').config()

// import routes
const mainRoutes = require('./src/routes/routes')

// declare app
const app = express()

// add security
app.use(cors({
  // change origin to the app port
  origin: ["*"],
  credentials: true
}))
app.use(cookieParser())
app.use(helmet())
app.use(hpp())

app.use(express.json({ limit: "6mb" }))
app.use(express.urlencoded({ extended: true }))

// rate limiting
// const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10000 });
// app.use(limiter)


// add the routes to the app
app.use('/public', mainRoutes)


// connect to databse
let option = { user: `${process.env.DB_USER}`, pass: `${process.env.DB_PASS}`, autoIndex: true }
mongoose.connect(process.env.DB_URL + "/" + process.env.DATABASE_NAME, option)
  .then(() => console.log("database connected"))
  .catch((error) => console.log("could not connect \n" + error))

module.exports = app
