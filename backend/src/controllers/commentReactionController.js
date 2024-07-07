const commentReactionService = require('../services/commentReactionService')
const asyncHandler = require('../utils/asyncHandler')


/*----------- reaction -------------*/

// create reaction
exports.reactionCreate = async (req, res) => {
  let result = await asyncHandler(() => commentReactionService.createReaction(req))
  res.status(200).json(result)
}

// update reaction
exports.reactionUpdate = async (req, res) => {
  let result = await asyncHandler(() => commentReactionService.updateReaction(req))
  res.status(200).json(result)
}

// remove reaction
exports.reactionRemove = async (req, res) => {
  let result = await asyncHandler(() => commentReactionService.removeReaction(req))
  res.status(200).json(result)
}

exports.reactionByPost = async (req, res) => {
  let result = await asyncHandler(() => commentReactionService.postReactions(req))
  res.status(200).json(result)
}

/*----------- comment -------------*/

// create comment
exports.commentCreate = async (req, res) => {
  let result = await asyncHandler(() => commentReactionService.createComment(req))
  res.status(200).json(result)
}

// update comment
exports.commentUpdate = async (req, res) => {
  let result = await asyncHandler(() => commentReactionService.updateComment(req))
  res.status(200).json(result)
}

// delete comment
exports.commentDelete = async (req, res) => {
  let result = await asyncHandler(() => commentReactionService.deleteComment(req))
  res.status(200).json(result)
}

// get all comment for a post
exports.getCommentByPost = async (req, res) => {
  let result = await asyncHandler(() => commentReactionService.getCommentsForPost(req))
  res.status(200).json(result)
}


/*----------- request -------------*/
// send a request
exports.requestSend = async (req, res) => {
  let result = await asyncHandler(() => commentReactionService.sendRequest(req))
  res.status(200).json(result)
}

// cancel a request
exports.requestCancel = async (req, res) => {
  let result = await asyncHandler(() => commentReactionService.cancelRequest(req))
  res.status(200).json(result)
}

// get the requests
exports.getRequests = async (req, res) => {
  let result = await asyncHandler(() => commentReactionService.fetchRequests(req))
  res.status(200).json(result)
}

// check requests
exports.checkRequest = async (req, res) => {
  let result = await asyncHandler(() => commentReactionService.checkRequest(req))
  res.status(200).json(result)
}

// confirm request
exports.requestConfirm = async (req, res) => {
  let result = await asyncHandler(() => commentReactionService.confirmRequest(req))
  res.status(200).json(result)
}