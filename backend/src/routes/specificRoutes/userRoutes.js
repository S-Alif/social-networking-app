const express = require('express')
const router = express.Router()

// import controllers
const userControl = require("../../controllers/userController")
const authVerification = require('../../middlewares/authVerification')


// user routes
router.post("/register", userControl.register)
router.post("/login", userControl.login)
router.post('/update', authVerification, userControl.update)
router.post('/delete',authVerification, userControl.delete)

router.post('/send-otp', userControl.otpSend)
router.post('/verify-otp', userControl.otpVerify)

router.get('/profile', authVerification, userControl.profile)
router.get('/profile/:id', authVerification, userControl.profileById)

router.get('/forget-pass-profile/:email', userControl.profileForgetPass)
router.post('/pass-renew', userControl.passRenew)

module.exports = router