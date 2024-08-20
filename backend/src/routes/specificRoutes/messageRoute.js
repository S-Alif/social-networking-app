const express = require('express')
const router = express.Router()

// controllers
const messageController = require('../../controllers/messageController')

// routes
router.get('/:to/:page/:limit', messageController.messageFetch)
router.post('/update/:id', messageController.updateMessage)
router.post('/delete/:id', messageController.deleteMessage)
router.post('/delete/chat', messageController.deleteChat)

module.exports = router