const reactionModel = require("../models/reactionModel")
const commentModel = require("../models/commentModel")
const friendshipModel = require("../models/friendshipModel")
const requestModel = require("../models/requestModel")
const { responseMsg } = require("../utils/helpers")
const postModel = require("../models/postModel")

const ObjectID = require('mongoose').Types.ObjectId

/*----------- reaction -------------*/

// create reaction
exports.createReaction = async (req) => {

  let count = await reactionModel.find({ author: new ObjectID(req.headers?.id), reactedOn: new ObjectID(req.body?.reactedOn) }).count('total')
  if (count > 0) return responseMsg(0, 200, "already reacted")

  req.body.author = req.headers?.id
  let react = await reactionModel.create(req.body)

  await postModel.updateOne({ _id: new ObjectID(req.body?.reactedOn) }, { $inc: { reactionCount: +1 } })

  return responseMsg(1, 200, react)
}

// update reaction
exports.updateReaction = async (req) => {
  let react = await reactionModel.findOne({ author: new ObjectID(req.headers?.id), reactedOn: new ObjectID(req.body?.reactedOn) }).exec()

  react.reaction = req.body?.reaction
  await react.save()

  return responseMsg(1, 200, react)
}

// remove reaction
exports.removeReaction = async (req) => {
  let react = await reactionModel.deleteOne({ _id: new ObjectID(req.params?.id), author: new ObjectID(req.headers?.id), reactedOn: new ObjectID(req.params?.post) })

  await postModel.updateOne({ _id: new ObjectID(req.params?.post) }, { $inc: { reactionCount: -1 } })

  return responseMsg(1, 200, "Reaction removed")
}

// get post reactions
exports.postReactions = async (req) => {

  let matchStage = { $match: { reactedOn: new ObjectID(req.params?.post) } }
  let lookUpStage = {
    $lookup: {
      from: 'users',
      localField: 'author',
      foreignField: '_id',
      as: 'author'
    }
  }

  let unwindStage = { $unwind: '$author' }
  let projectStage = {
    $project: {
      _id: 0,
      reaction: 1,
      authorId: '$author._id',
      authorProfileImg: '$author.profileImg',
      authorFirstName: '$author.firstName',
      authorLastName: '$author.lastName',
    }
  }

  let react = await reactionModel.aggregate([
    matchStage,
    lookUpStage,
    unwindStage,
    projectStage
  ])

  return responseMsg(1, 200, react)
}

/*----------- comment -------------*/

// create comment
exports.createComment = async (req) => {
  req.body.author = req.headers?.id
  let comment = await commentModel.create(req.body)
  await postModel.updateOne({ _id: new ObjectID(req.body?.commentOn) }, { $inc: { commentCount: +1 } })
  return responseMsg(1, 200, comment)
}

// update comment
exports.updateComment = async (req) => {
  let comment = await commentModel.updateOne({ _id: new ObjectID(req.body?.id), author: new ObjectID(req.headers?.id), commentOn: new ObjectID(req.body?.commentOn) }, { comment: req.body?.comment, edited: 1 })

  return responseMsg(1, 200, "comment updated")
}

// delete comment
exports.deleteComment = async (req) => {
  let comment = await commentModel.deleteOne({ _id: new ObjectID(req.params?.id), author: new ObjectID(req.headers?.id), commentOn: new ObjectID(req.params?.post) })
  await postModel.updateOne({ _id: new ObjectID(req.params?.post) }, { $inc: { commentCount: -1 } })

  return responseMsg(1, 200, "comment removed")
}

// get all comment for a post
exports.getCommentsForPost = async (req) => {

  const page = parseInt(req.params?.page)
  const limit = parseInt(req.params?.limit)
  const skip = (page - 1) * limit

  let matchStage = { $match: { commentOn: new ObjectID(req.params?.post) } }
  let sortStage = { $sort: { createdAt: -1 } }
  let skipStage = { $skip: skip }
  let limitStage = { $limit: limit }
  let lookUpStage = {
    $lookup: {
      from: 'users',
      localField: 'author',
      foreignField: '_id',
      as: 'author'
    }
  }

  let unwindStage = { $unwind: '$author' }
  let projectStage = {
    $project: {
      _id: 1,
      reaction: 1,
      authorId: '$author._id',
      authorProfileImg: '$author.profileImg',
      authorFirstName: '$author.firstName',
      authorLastName: '$author.lastName',
      createdAt: 1,
      edited: 1,
      comment: 1,
    }
  }

  let comment = await commentModel.aggregate([
    matchStage,
    sortStage,
    skipStage,
    limitStage,
    lookUpStage,
    unwindStage,
    projectStage
  ])

  return responseMsg(1, 200, comment)
}


/*--------------- requests ---------------- */
// send friend request
exports.sendRequest = async (req) => {
  if (req.headers?.id !== req.body?.from) return responseMsg(0, 200, "Login to send a request")

  let result = await requestModel.create(req.body)
  return responseMsg(1, 200, "Friend request sent")
}

// cancel sent request
exports.cancelRequest = async (req) => {
  if (!req.headers?.id || !req?.params?.id) return responseMsg(0, 200, "Login to cancel request")
  let result = await requestModel.findOneAndDelete({ from: req?.headers?.id, to: req?.params?.id, accepted: false })
  return responseMsg(1, 200, "Request canceled")
}

// fetch friend requests
exports.fetchRequests = async (req) => {
  if (!req.headers?.id) return responseMsg(0, 200, "Could not retrieve requests")
  let result = await requestModel.find({ to: req.headers?.id }).select("_id firstName lastName profileImg")

  return responseMsg(1, 200, result)
}

// check to see if profile has a request
exports.checkRequest = async (req) => {
  if (!req.headers?.id) return responseMsg(0, 200, "Log in")

  let browser = req.headers?.id
  let user = req.params?.id

  let result = await requestModel.findOne({ from: browser, accepted: false })
  if (result) return responseMsg(1, 200, { from: browser })

  let result2 = await requestModel.findOne({ from: user, accepted: false })
  if (result2) return responseMsg(1, 200, { from: user })

  return responseMsg(1, 200, { from: false })
}

// confirm request
exports.confirmRequest = async (req) => {
  if (req?.body?.accepted) {
    await friendshipModel.create({ user1: req.headers?.id, user2: req.body?.user })
    await requestModel.deleteOne({ from: req.headers?.id, to: req.body?.user })
    return responseMsg(1, 200, "Request accepted")
  }
  await requestModel.deleteOne({ from: req.headers?.id, to: req.body?.user })
  return responseMsg(1, 200, "Request rejected")
}