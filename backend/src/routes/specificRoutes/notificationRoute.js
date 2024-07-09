const express = require('express')
const router = express.Router()

// import controllers
const notficaitonController = require("../../controllers/notificationController")

// routes
router.get('/', notficaitonController.getNotification)
router.get('/:id', notficaitonController.oneNotification)
router.get('/many', notficaitonController.manyNotification)
router.get('/delete', notficaitonController.notificationsDelete)

module.exports = router