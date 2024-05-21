const userModel = require('../models/userModel')
const otpModel = require('../models/otpModel')
const { hashPass, responseMsg, verifyPass } = require('../utils/helpers')
const crypto = require("crypto")
const sendEmail = require('../utils/sendMail')
const { otpMail } = require('../utils/mail-markup')

// register a user
exports.registerUser = async (req) => {
  let check = await userModel.findOne({ email: req.body?.email }).count('total')
  if (check == 1) return responseMsg(0, 200, "Email already used")

  let passHash = await hashPass(req.body?.pass)
  req.body.pass = passHash
  let result = await userModel.create(req.body)
  return responseMsg(1, 200, "Account created")
}

// login a user
exports.loginUser = async (req) => {
  const user = await userModel.findOne({ email: req.body?.email }).select("_id email pass")
  if (!user) return responseMsg(0, 200, "No user found")

  const checkPass = await verifyPass(user.pass, req.body?.pass)
  if (!checkPass) return responseMsg(0, 200, "Password not matching")

  return responseMsg(1, 200, { id: user?._id, email: user?.email })
}

// update a user
exports.updateUser = async (req) => {

}

// delete a user
exports.deleteUser = async (req) => {

}

// send otp
exports.sendOtp = async (req) => {
  let otpCode = crypto.randomBytes(3).toString('hex').toUpperCase()

  let result = await otpModel.create({otp: otpCode, email: req.body?.email})
  let user = await userModel.findOne({email: req.body.email}).select("firstName")
  await sendEmail(
    req.body.email,
    otpMail(otpCode,user?.firstName,
    `${req.body?.type == 1 ? "Please verify your account": "Thank you and welcome to our platform"}`)
  )
  
  return responseMsg(1, 200, "Verification email sent")
}

// verify otp
exports.verifyOtp = async (req) => {
  let check = await otpModel.findOne({ otp: req.body?.otp, email: req.body?.email, verified: 0 })
  if(!check) return responseMsg(0,200, "Invalid otp")
  await otpModel.updateOne({ otp: req.body?.otp, email: req.body?.email }, {verified: 1})
  return responseMsg(1, 200, "Account verified")
}

// get user profile
exports.userProfile = async (req) => {

}

// get a user profile by id
exports.userProfileById = async (req) => {

}

// forget pass user profile
exports.forgetPassUserProfile = async (req) => {

}

// renew password
exports.renewPass = async (req) => {

}