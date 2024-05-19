const userModel = require('../models/userModel')

// register a user
exports.registerUser = async (req) => {
  let result = userModel.create(req.body)
}

// login a user
exports.loginUser = async (req) => {
  
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