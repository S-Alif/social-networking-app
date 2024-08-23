const messageModel = require("../models/messageModel")
const ObjectID = require('mongoose').Types.ObjectId
const { responseMsg } = require("../utils/helpers")


// fetch chat list
exports.fetchChatList = async (req) => {
  let user = req.headers?.id
  if (!user) return responseMsg(0, 200, "Please log in")

  let page = parseInt(req?.params?.page)
  let limit = parseInt(req?.params?.limit)
  let skip = (page - 1) * limit

  // aggregation stages
  let match = {
    $match: {
      $or: [
        { from: new ObjectID(user) },
        { to: new ObjectID(user) }
      ]
    }
  }

  let messages = {
    $group: {
      _id: {
        $cond: [
          { $eq: ["$from", new ObjectID(user)] },
          "$to",
          "$from"
        ]
      },
      latestMessage: { $first: "$$ROOT" }
    }
  }

  let sort = {
    $sort: { "latestMessage.createdAt": -1 }
  }
  let skipStage = {
    $skip: skip
  }
  let limiting = {
    $limit: limit
  }

  let users = {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "_id",
      as: "userDetails"
    }
  }

  let unwind = {
    $unwind: "$userDetails"
  }

  let projection = {
    $project: {
      _id: 0,
      userId: "$userDetails._id",
      firstName: "$userDetails.firstName",
      lastName: "$userDetails.lastName",
      profileImg: "$userDetails.profileImg",
      latestMessage: {
        msgUser: "$latestMessage.from",
        message: "$latestMessage.message",
        createdAt: "$latestMessage.createdAt",
        seen: "$latestMessage.seen"
      }
    }
  }

  let facet = {
    $facet: {
      chatList: [
        sort,
        skipStage,
        limiting,
        projection
      ],
      totalCount: [
        { $count: "count" }
      ]
    }
  }

  let list = await messageModel.aggregate([match, messages, users, unwind, facet])

  let { chatList, totalCount } = list[0]

  return responseMsg(1, 200, {chatList, totalCount: totalCount[0]?.count ? totalCount[0].count : 0})
}

// fetch message
exports.fetchMessages = async (req) => {

  let from = req.headers?.id
  if(!from) return responseMsg(0, 200, "Please log in")

  let to = req?.params?.to
  let page = parseInt(req?.params?.page)
  let limit = parseInt(req?.params?.limit)
  let skip = (page - 1) * limit

  let messages = await messageModel.find({
    $or: [
      { from: new ObjectID(from), to: new ObjectID(to) },
      { from: new ObjectID(to), to: new ObjectID(from) },
    ]
  }).sort({ createdAt: -1 }).skip(skip).limit(limit)

  return responseMsg(1, 200, messages)
}

// message update
exports.messageUpdate = async (req) => {
  await messageModel.updateOne({_id: req?.params?.id, from: new ObjectID(req.headers?.id)}, {message: req.body?.message, edited: true})
  return responseMsg(1, 200, "Message updated")
}

// message delete
exports.messageDelete = async (req) => {
  await messageModel.deleteOne({ _id: req?.params?.id, from: new ObjectID(req.headers?.id) })
  return responseMsg(1, 200, "Message deleted")
}

// chat delete
exports.chatDelete = async (req) => {
  await messageModel.deleteMany({ from: new ObjectID(req.headers?.id) })
  return responseMsg(1, 200, "Chat deleted from your end")
}

// msg seen
exports.msgSeen = async (req) => {
  await messageModel.updateMany({ to: new ObjectID(req.headers?.id), seen: false }, {seen: true})
  return responseMsg(1, 200, "seen")
}