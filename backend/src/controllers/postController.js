const posetService = require('../services/postService')
const asyncHandler = require('../utils/asyncHandler')

// create post
exports.postCreate = asyncHandler(async (req, res) => {
  let result = await posetService.createPost(req)
  res.status(200).json(result)
})

// update post
exports.postUpdate = asyncHandler(async (req, res) => {
  let result = await posetService.updatePost(req)
  res.status(200).json(result)
})

// delete post
exports.postDelete = asyncHandler(async (req, res) => {
  let result = await posetService.deletePost(req)
  res.status(200).json(result)
})

// get a single post
exports.singlePost = asyncHandler(async (req, res) => {
  let result = await posetService.getSinglePost(req)
  res.status(200).json(result)
})

// get a lot of posts
exports.lotOfPosts = asyncHandler(async (req, res) => {
  let result = await posetService.getLotOfPosts(req)
  res.status(200).json(result)
})

// report a post
exports.postReport = asyncHandler(async (req, res) => {
  let result = await posetService.reportPost(req)
  res.status(200).json(result)
})