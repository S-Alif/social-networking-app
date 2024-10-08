const express = require('express')
const fileUpload = require('express-fileupload')
const router = express.Router()


// import controllers
const postControl = require("../../controllers/postController")

// middleware
const fileChecker = require('../../middlewares/fileChecker')

// routes
router.get("/posts/:type/:page/:limit", postControl.lotOfPosts)
router.get('/posts/:id', postControl.singlePost)
router.get('/posts/user/:type/:page/:limit/:user', postControl.postByUser)

router.post('/create', fileUpload({ createParentPath: true }), fileChecker, postControl.postCreate)
router.post('/update', postControl.postUpdate)
router.post('/delete/:id/:user', postControl.postDelete)
router.post('/report/:id', postControl.postReport)

module.exports = router