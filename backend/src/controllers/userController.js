const userService = require('../services/userService')
const asyncHandler = require('../utils/asyncHandler')


// register
exports.register = asyncHandler(async (req, res) => {
  let result = await userService.registerUser(req)
  res.status(200).json(result)
})

// login
exports.login = asyncHandler(async (req, res) => {
  let result = await userService.loginUser(req)

  // login code

  // res.status(200).json(result)
})

// update
exports.update = asyncHandler(async (req, res) => {
  let result = await userService.updateUser(req)
  res.status(200).json(result)
})

// delete
exports.deleteUser = asyncHandler(async (req, res) => {
  let result = await userService.deleteUser(req)
  res.status(200).json(result)
})

// sendOtop
exports.otpSend = asyncHandler(async (req, res) => {
  let result = await userService.sendOtp(req)
  res.status(200).json(result)
})

// verify otp
exports.otpVerify = asyncHandler(async (req, res) => {
  let result = await userService.verifyOtp(req)
  res.status(200).json(result)
})

// get user profile
exports.profile = asyncHandler(async (req, res) => {
  let result = await userService.userProfile(req)
  res.status(200).json(result)
})

// get a user profile by id
exports.profileById = asyncHandler(async (req, res) => {
  let result = await userService.userProfileById(req)
  res.status(200).json(result)
})

// forget pass user profile
exports.profileForgetPass = asyncHandler(async (req, res) => {
  let result = await userService.forgetPassUserProfile(req)
  res.status(200).json(result)
})

// renew password
exports.passRenew = asyncHandler(async (req, res) => {
  let result = await userService.renewPass(req)
  res.status(200).json(result)
})