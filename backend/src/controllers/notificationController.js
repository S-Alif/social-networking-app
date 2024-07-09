const notificationService = require('../services/notificationService')
const asyncHandler = require("../utils/asyncHandler")

// get notifications
exports.getNotification = async (req, res) => {
  let result = await asyncHandler(() => notificationService.fetchNotification(req))
  res.status(200).json(result)
}

// see a notifications
exports.oneNotification = async (req, res) => {
  let result = await asyncHandler(() => notificationService.seeOneNotification(req))
  res.status(200).json(result)
}

// see many notifications
exports.manyNotification = async (req, res) => {
  let result = await asyncHandler(() => notificationService.seeManyNotification(req))
  res.status(200).json(result)
}

// delete many notifications
exports.notificationsDelete = async (req, res) => {
  let result = await asyncHandler(() => notificationService.deleteNotifications(req))
  res.status(200).json(result)
}
