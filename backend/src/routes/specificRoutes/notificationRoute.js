const express = require('express')
const router = express.Router()

// import controllers
const notficaitonController = require("../../controllers/notificationController")

// routes
router.get('/many', notficaitonController.manyNotification)
router.get('/delete', notficaitonController.notificationsDelete)
router.get('/:id', notficaitonController.oneNotification)
router.get('/:page/:limit', notficaitonController.getNotification)

module.exports = router