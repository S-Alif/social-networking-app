const userModel = require('../models/userModel')
const { hashPass, responseMsg, verifyPass } = require('../utils/helpers')

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

}

// verify otp
exports.verifyOtp = async (req) => {

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