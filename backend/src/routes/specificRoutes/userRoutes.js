const express = require('express')
const fileUpload = require('express-fileupload')
const router = express.Router()

// import controllers
const userControl = require("../../controllers/userController")

// middlewares
const authVerification = require('../../middlewares/authVerification')
const fileChecker = require('../../middlewares/fileChecker')


// user routes
router.post("/register", userControl.register)
router.post("/login", userControl.login)
router.post('/update', authVerification, userControl.update)
router.post('/delete',authVerification, userControl.delete)

router.post('/update/profile-image', authVerification, fileUpload({ createParentPath: true }), fileChecker, userControl.profileImgUpdate)
router.post('/update/profile-cover', authVerification, fileUpload({ createParentPath: true }), fileChecker, userControl.profileImgUpdate)

router.post('/send-otp', userControl.otpSend)
router.post('/verify-otp', userControl.otpVerify)

router.get('/profile', authVerification, userControl.profile)
router.get('/profile/:id', authVerification, userControl.profileById)

router.get('/forget-pass-profile/:email', userControl.profileForgetPass)
router.post('/pass-renew', userControl.passRenew)

module.exports = router