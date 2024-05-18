const express = require('express')
const router = express.Router()

// import controllers
const userControl = require("../../controllers/userController")


// user routes
router.post("/register", userControl.register)
router.post("/login", userControl.login)
router.post('/update', userControl.update)
router.post('/delete', userControl.delete)

router.post('/send-otp', userControl.otpSend)
router.post('/verify-otp', userControl.otpVerify)

router.get('/profile', userControl.profile)
router.get('/profile/:id', userControl.profileById)

router.get('/forget-pass-profile/:email', userControl.profileForgetPass)
router.post('/pss-renew', userControl.passRenew)

module.exports = router