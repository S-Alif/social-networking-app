const commentReactionService = require('../services/commentReactionService')
const asyncHandler = require('../utils/asyncHandler')


/*----------- reaction -------------*/

// create reaction
exports.reactionCreate = asyncHandler(async (req, res) => {
  let result = await commentReactionService.createReaction(req)
  res.status(200).json(result)
})

// update reaction
exports.reactionUpdate = asyncHandler(async (req, res) => {
  let result = await commentReactionService.updateReaction(req)
  res.status(200).json(result)
})

// remove reaction
exports.reactionRemove = asyncHandler(async (req, res) => {
  let result = await commentReactionService.removeReaction(req)
  res.status(200).json(result)
})


/*----------- comment -------------*/

// create comment
exports.commentCreate = asyncHandler(async (req, res) => {
  let result = await commentReactionService.createComment(req)
  res.status(200).json(result)
})

// update comment
exports.commentUpdate = asyncHandler(async (req, res) => {
  let result = await commentReactionService.updateComment(req)
  res.status(200).json(result)
})

// delete comment
exports.commentDelete = asyncHandler(async (req, res) => {
  let result = await commentReactionService.deleteComment(req)
  res.status(200).json(result)
})

// get all comment for a post
exports.getCommentByPost = asyncHandler(async (req, res) => {
  let result = await commentReactionService.getCommentsForPost(req)
  res.status(200).json(result)
})