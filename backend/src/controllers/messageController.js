const messageService = require("../services/messageService")
const asyncHandler = require("../utils/asyncHandler")


// fetch chat list
exports.chatList = async (req, res) => {
  let result = await asyncHandler(() => messageService.fetchChatList(req))
  res.status(200).json(result)
}

// fetch message
exports.messageFetch = async (req, res) => {
  let result = await asyncHandler(() => messageService.fetchMessages(req))
  res.status(200).json(result)
}

// message update
exports.updateMessage = async (req, res) => {
  let result = await asyncHandler(() => messageService.messageUpdate(req))
  res.status(200).json(result)
}

// message delete
exports.deleteMessage = async (req, res) => {
  let result = await asyncHandler(() => messageService.messageDelete(req))
  res.status(200).json(result)
}

// chat delete
exports.deleteChat = async (req, res) => {
  let result = await asyncHandler(() => messageService.chatDelete(req))
  res.status(200).json(result)
}

// see msg
exports.seeMsg = async (req) => {
  let result = await asyncHandler(() => messageService.msgSeen(req))
  res.status(200).json(result)
}