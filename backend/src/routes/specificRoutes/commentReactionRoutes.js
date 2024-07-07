const express = require('express')
const router = express.Router()


// controllers
const commentReactionController = require('../../controllers/commentReactionController')


// routes
router.post('/react', commentReactionController.reactionCreate)
router.post('/react/update', commentReactionController.reactionUpdate)
router.post('/react/delete/:post/:id', commentReactionController.reactionRemove)
router.get("/react/:post", commentReactionController.reactionByPost)

router.post('/comment', commentReactionController.commentCreate)
router.post('/comment/update', commentReactionController.commentUpdate)
router.post('/comment/delete/:post/:id', commentReactionController.commentDelete)
router.get('/comment/:post/:page/:limit', commentReactionController.getCommentByPost)

router.post('/send-request', commentReactionController.requestSend)
router.get('/fetch-request', commentReactionController.getRequests)
router.post('/cancel-request/:id', commentReactionController.requestCancel)
router.get('/check-request/:id', commentReactionController.checkRequest)
router.post('/confirm-request', commentReactionController.requestConfirm)

module.exports = router