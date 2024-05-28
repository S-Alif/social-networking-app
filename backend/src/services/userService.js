const userModel = require('../models/userModel')
const otpModel = require('../models/otpModel')
const friendshipModel = require('../models/friendshipModel')

const { hashPass, responseMsg, verifyPass } = require('../utils/helpers')
const sendEmail = require('../utils/sendMail')
const { otpMail } = require('../utils/mail-markup')

const crypto = require("crypto")
const ObjectID = require('mongoose').Types.ObjectId

// register a user
exports.registerUser = async (req) => {
  let check = await userModel.findOne({ email: req.body?.email }).count('total')
  if (check == 1) return responseMsg(0, 200, "Email already used")

  let passHash = await hashPass(req.body?.pass)
  req.body.pass = passHash

  // add default profile image and cover
  req.body.profileImg = `https://avatar.iran.liara.run/username?username=${req.body?.firstName.split(" ")[0]}+${req.body?.lastName}&size=1024&format=png`
  req.body.profileCover = `https://dummyimage.com/1920x1080/${Math.floor(Math.random() * 16777215).toString(16)}/ffffff&text=${req.body?.firstName.split(" ")[0]}+${req.body?.lastName}`

  let result = await userModel.create(req.body)

  return responseMsg(1, 200, "Account created")
}

// login a user
exports.loginUser = async (req) => {
  const user = await userModel.findOne({ email: req.body?.email }).select("_id email pass isAdmin")
  if (!user) return responseMsg(0, 200, "No user found")

  const checkPass = await verifyPass(user.pass, req.body?.pass)
  if (!checkPass) return responseMsg(0, 200, "Password not matching")

  return responseMsg(1, 200, { id: user?._id, email: user?.email, isAdmin: user?.isAdmin })
}

// update a user
exports.updateUser = async (req) => {
  if(req.headers?.id !== req.body._id) return responseMsg(0, 200, "user ID dont match")
  await userModel.updateOne({_id: new ObjectID(req.headers?.id)}, req.body)
  return responseMsg(1, 200, "Account updated")
}

// delete a user
exports.deleteUser = async (req) => {

}

// send otp
exports.sendOtp = async (req) => {
  let otpCode = crypto.randomBytes(3).toString('hex').toUpperCase()

  let result = await otpModel.create({otp: otpCode, email: req.body?.email})
  let user = await userModel.findOne({email: req.body.email}).select("lastName")
  await sendEmail(
    req.body.email,
    otpMail(
      otpCode,
      user?.lastName,
      `${req.body?.type == 1 ? "Please verify your account": "Thank you and welcome to our platform"}`
    ),
    "Account verification"
  )
  
  return responseMsg(1, 200, "Verification email sent")
}

// verify otp
exports.verifyOtp = async (req) => {
  let check = await otpModel.findOne({ otp: req.body?.otp, email: req.body?.email, verified: 0 })
  if(!check) return responseMsg(0,200, "Invalid otp")

  await otpModel.updateOne({ otp: req.body?.otp, email: req.body?.email }, {verified: 1})
  await userModel.updateOne({ email: req.body?.email }, {verified: 1})

  return responseMsg(1, 200, "Account verified")
}

// get user profile
exports.userProfile = async (req) => {
  let profile = await userModel.findOne({ _id: new ObjectID(req.headers.id) }).select("-pass")
  if(!profile) return responseMsg(0, 200, "No user found")
  
  return responseMsg(1, 200, profile)
}

// get a user profile by id
exports.userProfileById = async (req) => {

  let isAdmin = req.headers.isAdmin
  let browser = req.headers?.id
  let profile = req.params.id

  if(isAdmin == true){ // if admin true
    var user = await userModel.findOne({ _id: new ObjectID(req.params.id) }).select("-pass")

    return responseMsg(1, 200, user)
  }
  
  user = await userModel.findOne({ _id: new ObjectID(profile) }).select("-pass")
  if (!user) return responseMsg(0, 200, "No user found")
    
  const { privacy } = user;

  if (privacy === 'public') {
    return responseMsg(1, 200, user)
  } 
  else if (privacy === 'friends' && browser) {
    const friendship = await friendshipModel.findOne({
      $or: [
        { user1: ObjectID(browser), user2: ObjectID(profile) },
        { user1: ObjectID(profile), user2: ObjectID(browser) }
      ]
    })

    if (!friendship) return responseMsg(1, 200, {_id: user._id, firstName: user?.firstName, lastName: user?.lastName, profileImg: user?.profileImg, profileCover: user?.profileCover, privacy: user?.privacy, status: user?.status})
    return responseMsg(1, 200, user)

  } 
  else {
    return responseMsg(1, 200, { _id: user._id, firstName: user?.firstName, lastName: user?.lastName, profileImg: user?.profileImg, profileCover: user?.profileCover, privacy: user?.privacy, status: user?.status })
  }
}

// forget pass user profile
exports.forgetPassUserProfile = async (req) => {

}

// renew password
exports.renewPass = async (req) => {

}