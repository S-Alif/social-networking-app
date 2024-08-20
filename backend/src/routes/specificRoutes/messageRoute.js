const express = require('express')
const router = express.Router()

// controllers
const messageController = require('../../controllers/messageController')

// routes
router.get('/list/:page/:limit', messageController.chatList)
router.post('/update/:id', messageController.updateMessage)
router.post('/delete/:id', messageController.deleteMessage)
router.post('/delete/chat', messageController.deleteChat)
router.post('/seen-msg', messageController.seeMsg)
router.get('/:to/:page/:limit', messageController.messageFetch)

module.exports = router