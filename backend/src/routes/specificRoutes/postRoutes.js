const express = require('express')
const router = express.Router()

// import controllers
const postControl = require("../../controllers/postController")

// routes
router.get("/posts", postControl.lotOfPosts)
router.get('/posts/:id', postControl.singlePost)

router.post('/create', postControl.postCreate)
router.post('/update', postControl.postUpdate)
router.post('/delete/:id', postControl.postUpdate)
router.post('/report/:id', postControl.postReport)

module.exports = router