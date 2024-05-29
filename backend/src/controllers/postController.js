const postService = require('../services/postService')
const asyncHandler = require('../utils/asyncHandler')

// create post
exports.postCreate = async (req, res) => {
  let result = await asyncHandler(() => postService.createPost(req))
  res.status(200).json(result)
}

// update post
exports.postUpdate = async (req, res) => {
  let result = await asyncHandler(() => postService.updatePost(req))
  res.status(200).json(result)
}

// delete post
exports.postDelete = async (req, res) => {
  let result = await asyncHandler(() => postService.deletePost(req))
  res.status(200).json(result)
}

// get a single post
exports.singlePost = async (req, res) => {
  let result = await asyncHandler(() => postService.getSinglePost(req))
  res.status(200).json(result)
}

// get a lot of posts
exports.lotOfPosts = async (req, res) => {
  let result = await asyncHandler(() => postService.getLotOfPosts(req))
  res.status(200).json(result)
}

// get post by user
exports.postByUser = async (req, res) => {
  let result = await asyncHandler(() => postService.getPostByUser(req))
  res.status(200).json(result)
}

// get user posts and friend count
exports.userFriendAndPostAmount = async (req, res) => {
  let result = await asyncHandler(() => postService.getFriendsAndPostAmount(req))
  res.status(200).json(result)
}

// report a post
exports.postReport = async (req, res) => {
  let result = await asyncHandler(() => postService.reportPost(req))
  res.status(200).json(result)
}