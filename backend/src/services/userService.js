const userModel = require('../models/userModel')
const otpModel = require('../models/otpModel')
const friendshipModel = require('../models/friendshipModel')

const { hashPass, responseMsg, verifyPass } = require('../utils/helpers')
const sendEmail = require('../utils/sendMail')
const { otpMail } = require('../utils/mail-markup')

const crypto = require("crypto")
const { deleteFiles, attachmentUploader } = require('../utils/postAttachmentUploader')
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

// update a user information
exports.updateUser = async (req) => {
  if (req.headers?.id !== req.body._id) return responseMsg(0, 200, "user ID dont match")
  await userModel.updateOne({ _id: new ObjectID(req.headers?.id) }, req.body)
  return responseMsg(1, 200, "Account updated")
}

// update user profile image
exports.updateUserProfileImg = async (req) => {
  let files = req.files
  if (!files) return responseMsg(0, 200, "No image found")
  let currentImg = await userModel.findOne({ _id: new ObjectID(req.headers?.id) }).select('profileImg')

  const parseUrl = new URL(currentImg?.profileImg)
  if (parseUrl.hostname === 'res.cloudinary.com') {
    await deleteFiles([currentImg?.profileImg])
  }

  let urlArray = []

  try {
    const promises = Object.keys(req.files).flatMap(key => {
      const fileArray = Array.isArray(req.files[key]) ? req.files[key] : [req.files[key]]
      return fileArray.map(file => attachmentUploader(file))
    })

    urlArray = await Promise.all(promises)
    if (urlArray.includes(null)) {
      await deleteFiles(urlArray.filter(url => url !== null))
      return responseMsg(0, 200, "Could not upload profile image")
    }
  } catch (error) {
    return responseMsg(0, 200, "An error occurred while uploading profile image")
  }

  await userModel.updateOne({ _id: req.headers?.id }, { profileImg: urlArray[0] })
  return responseMsg(1, 200, "profile image uploaded")
}

// update user profile cover
exports.updateUserProfileCover = async (req) => {
  let files = req.files
  if (!files) return responseMsg(0, 200, "No image found")
  let currentImg = await userModel.findOne({ _id: new ObjectID(req.headers?.id) }).select('profileCover')

  const parseUrl = new URL(currentImg?.profileCover)
  if (parseUrl.hostname === 'res.cloudinary.com') {
    await deleteFiles([currentImg?.profileCover])
  }

  let urlArray = []

  try {
    const promises = Object.keys(req.files).flatMap(key => {
      const fileArray = Array.isArray(req.files[key]) ? req.files[key] : [req.files[key]]
      return fileArray.map(file => attachmentUploader(file))
    })

    urlArray = await Promise.all(promises)
    if (urlArray.includes(null)) {
      await deleteFiles(urlArray.filter(url => url !== null))
      return responseMsg(0, 200, "Could not upload profile cover")
    }
  } catch (error) {
    return responseMsg(0, 200, "An error occurred while uploading profile cover")
  }

  await userModel.updateOne({ _id: req.headers?.id }, { profileCover: urlArray[0] })
  return responseMsg(1, 200, "profile cover uploaded")
}

// delete a user
exports.deleteUser = async (req) => {

}

// send otp
exports.sendOtp = async (req) => {
  let otpCode = crypto.randomBytes(3).toString('hex').toUpperCase()

  let result = await otpModel.create({ otp: otpCode, email: req.body?.email })
  let user = await userModel.findOne({ email: req.body.email }).select("lastName")
  await sendEmail(
    req.body.email,
    otpMail(
      otpCode,
      user?.lastName,
      `${req.body?.type == 1 ? "Please verify your account" : "Thank you and welcome to our platform"}`
    ),
    "Account verification"
  )

  return responseMsg(1, 200, "Verification email sent")
}

// verify otp
exports.verifyOtp = async (req) => {
  let check = await otpModel.findOne({ otp: req.body?.otp, email: req.body?.email, verified: 0 })
  if (!check) return responseMsg(0, 200, "Invalid otp")

  await otpModel.updateOne({ otp: req.body?.otp, email: req.body?.email }, { verified: 1 })
  await userModel.updateOne({ email: req.body?.email }, { verified: 1 })

  return responseMsg(1, 200, "Account verified")
}

// get user profile
exports.userProfile = async (req) => {
  let profile = await userModel.findOne({ _id: new ObjectID(req.headers.id) }).select("-pass")
  if (!profile) return responseMsg(0, 200, "No user found")

  return responseMsg(1, 200, profile)
}

// get a user profile by id
exports.userProfileById = async (req) => {

  let isAdmin = req.headers.isAdmin
  let browser = req.headers?.id
  let profile = req.params.id

  if (isAdmin == true) { // if admin true
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
        { user1: new ObjectID(browser), user2: new ObjectID(profile) },
        { user1: new ObjectID(profile), user2: new ObjectID(browser) }
      ]
    })

    if (!friendship) return responseMsg(1, 200, { _id: user._id, firstName: user?.firstName, lastName: user?.lastName, profileImg: user?.profileImg, profileCover: user?.profileCover, privacy: user?.privacy, status: user?.status, createdAt: user?.createdAt, isFriends: false })

    user.isFriends = true
    return responseMsg(1, 200, user)

  }
  else {
    return responseMsg(1, 200, { _id: user._id, firstName: user?.firstName, lastName: user?.lastName, profileImg: user?.profileImg, profileCover: user?.profileCover, privacy: user?.privacy, status: user?.status, createdAt: user?.createdAt })
  }
}

// forget pass user profile
exports.forgetPassUserProfile = async (req) => {

}

// renew password
exports.renewPass = async (req) => {

}