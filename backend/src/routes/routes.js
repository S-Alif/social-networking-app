const express = require('express')
const router = express.Router()

// import other routers
const userRoutes = require('./specificRoutes/userRoutes')
const postRoutes = require('./specificRoutes/postRoutes')
const commentReactionRoutes = require('./specificRoutes/commentReactionRoutes')

// middleware
const authVerification = require('../middlewares/authVerification')



// route paths
router.use('/user', userRoutes)
router.use('/post', authVerification, postRoutes)
router.use('/engagement', authVerification, commentReactionRoutes)

module.exports = router