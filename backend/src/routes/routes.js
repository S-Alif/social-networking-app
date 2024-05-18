const express = require('express')
const router = express.Router()

// import other routers
const userRoutes = require('./specificRoutes/userRoutes')


// route paths
router.use('/user', userRoutes)

module.exports = router