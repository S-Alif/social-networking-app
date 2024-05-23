const express = require('express')
const fileUpload = require('express-fileupload')
const router = express.Router()


// import controllers
const postControl = require("../../controllers/postController")

// middleware
const fileChecker = require('../../middlewares/fileChecker')

// routes
router.get("/posts", postControl.lotOfPosts)
router.get('/posts/:id', postControl.singlePost)

router.post('/create', fileUpload({ createParentPath: true }), fileChecker, postControl.postCreate)
router.post('/update', postControl.postUpdate)
router.post('/delete/:id', postControl.postUpdate)
router.post('/report/:id', postControl.postReport)

module.exports = router