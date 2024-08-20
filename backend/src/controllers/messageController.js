const messageService = require("../services/messageService")
const asyncHandler = require("../utils/asyncHandler")


// fetch message
exports.messageFetch = async (req) => {
  let result = await asyncHandler(() => messageService.fetchMessages(req))
  res.status(200).json(result)
}

// message update
exports.updateMessage = async (req) => {
  let result = await asyncHandler(() => messageService.messageUpdate(req))
  res.status(200).json(result)
}

// message delete
exports.deleteMessage = async (req) => {
  let result = await asyncHandler(() => messageService.messageDelete(req))
  res.status(200).json(result)
}

// chat delete
exports.deleteChat = async (req) => {
  let result = await asyncHandler(() => messageService.chatDelete(req))
  res.status(200).json(result)
}