const userService = require('../services/userService')
const asyncHandler = require('../utils/asyncHandler')
const { cookieMaker, issueToken } = require('../utils/helpers')


// register
exports.register = async (req, res) => {
  let result = await asyncHandler(() => userService.registerUser(req))
  res.status(200).json(result)
}

// login
exports.login = async (req, res) => {
  let result = await asyncHandler(() => userService.loginUser(req))
  if (result?.status == 0) return res.status(200).json(result)

  // for website 
  // let cookie = cookieMaker(
  //   {
  //     id: result.data.id,
  //     email: result.data.email
  //   },
  //   "3d"
  // )

  let token = issueToken({
    id: result.data.id,
    email: result.data.email,
    isAdmin: result.data.isAdmin
  },
    "3d")
  res.status(200).json({
    id: result.data.id,
    email: result.data.email,
    isAdmin: result.data.isAdmin,
    token: token
  })
}

// update
exports.update = async (req, res) => {
  let result = await asyncHandler(() => userService.updateUser(req))
  res.status(200).json(result)
}

// delete
exports.delete = async (req, res) => {
  let result = await asyncHandler(() => userService.deleteUser(req))
  res.status(200).json(result)
}

// sendOtop
exports.otpSend = async (req, res) => {
  let result = await asyncHandler(() => userService.sendOtp(req))
  res.status(200).json(result)
}

// verify otp
exports.otpVerify = async (req, res) => {
  let result = await asyncHandler(() => userService.verifyOtp(req))
  res.status(200).json(result)
}

// get user profile
exports.profile = async (req, res) => {
  let result = await asyncHandler(() => userService.userProfile(req))
  res.status(200).json(result)
}

// get a user profile by id
exports.profileById = async (req, res) => {
  let result = await asyncHandler(() => userService.userProfileById(req))
  res.status(200).json(result)
}

// forget pass user profile
exports.profileForgetPass = async (req, res) => {
  let result = await asyncHandler(() => userService.forgetPassUserProfile(req))
  res.status(200).json(result)
}

// renew password
exports.passRenew = async (req, res) => {
  let result = await asyncHandler(() => userService.renewPass(req))
  res.status(200).json(result)
}