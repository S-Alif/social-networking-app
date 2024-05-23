const postModel = require('../models/postModel');
const { responseMsg } = require('../utils/helpers');
const { imageUploader } = require('../utils/postAttachmentUploader');

// create post
exports.createPost = async (req) => {

  let urlArray = []

  const promises = Object.keys(req.files).flatMap(key => {
    const fileArray = Array.isArray(req.files[key]) ? req.files[key] : [req.files[key]];

    return fileArray.map(file => imageUploader(file));
  });

  urlArray = await Promise.all(promises)

  return responseMsg(1, 200, urlArray)
}

// update post
exports.updatePost = async (req) => {

}

// delete post
exports.deletePost = async (req) => {

}

// get a single post
exports.getSinglePost = async (req) => {

}

// get a lot of posts
exports.getLotOfPosts = async (req) => {

}

// report a post
exports.reportPost = async (req) => {

}