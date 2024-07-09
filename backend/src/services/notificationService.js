const notificationModel = require("../models/notificationModel");
const { responseMsg } = require("../utils/helpers");
const ObjectID = require('mongoose').Types.ObjectId

// fetch notificaitons
exports.fetchNotification = async (req) => {
  let notificaitons = await notificationModel.aggregate([
    { $match: { notificationTo: new ObjectID(req.headers?.id) } },
    {
      $lookup: {
        from: "users",
        localField: "notificationFrom",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        "userId": "$user._id",
        "firstName": "$user.firstName",
        "lastName": "$user.lastName",
        "profileImg": "$user.profileImg",
        type: 1,
        seen: 1,
        postType: 1,
        postId: 1,
        createdAt: 1
      }
    }
  ])

  return responseMsg(1, 200, notificaitons)
}

// update a notification
exports.seeOneNotification = async (req) => {
  await notificationModel.updateOne({ _id: new ObjectID(req?.params?.id) }, { seen: true })
  return responseMsg(1, 200, "Notification seen")
}

// update a lot of notificaion to seen
exports.seeManyNotification = async (req) => {
  await notificationModel.updateMany({ notificationTo: new ObjectID(req?.headers?.id) }, { seen: true })
  return responseMsg(1, 200, "Notifications marked as seen")
}

// delete many notifications
exports.deleteNotifications = async (req) => {
  await notificationModel.deleteMany({ notificationTo: new ObjectID(req?.headers?.id), seen: true })
  return responseMsg(1, 200, "Deleted seen notifications")
}