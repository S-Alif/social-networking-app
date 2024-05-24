const postModel = require('../models/postModel');
const attachmentModel = require('../models/postAttachmentModel');
const { responseMsg } = require('../utils/helpers');
const { imageUploader, deleteFiles } = require('../utils/postAttachmentUploader');

// create post
exports.createPost = async (req) => {

  if (!req?.files && !req.body?.caption) return responseMsg(0, 200, "No data to post");

  let urlArray = []
  let fileTypeArray = []

  // Upload files to Cloudinary if they exist
  if (req.files) {
    try {
      const promises = Object.keys(req.files).flatMap(key => {
        const fileArray = Array.isArray(req.files[key]) ? req.files[key] : [req.files[key]]

        fileArray.forEach(file => fileTypeArray.push(file.mimetype))
        return fileArray.map(file => imageUploader(file))
      })

      urlArray = await Promise.all(promises);
      if (urlArray.includes(null)) {
        await deleteFiles(urlArray.filter(url => url !== null))
        return responseMsg(0, 200, "Could not upload files")
      }
    } catch (error) {
      return responseMsg(0, 200, "An error occurred while uploading attachments")
    }
  }


  // Create a post
  var createPost;
  try {
    createPost = await postModel.create({ author: req.headers.id, caption: req.body?.caption || "", postType: req.body?.postType })
    if (!createPost) throw new Error("Post creation failed")
    
  } catch (error) {
    await deleteFiles(urlArray)
    return responseMsg(0, 200, "Could not post")
  }

  // Upload the file URLs to the database
  try {
    if (urlArray.length > 0) {
      await Promise.all(
        urlArray.map(async (e, index) => {
          await attachmentModel.create({
            postId: createPost?._id,
            fileLocation: e,
            fileType: fileTypeArray[index].split('/')[0] === "image" ? "image" : "video"
          })
        })
      )
    }
  } catch (error) {
    await postModel.deleteOne({ _id: createPost?._id })
    await deleteFiles(urlArray)
    return responseMsg(0, 200, "An error occurred while saving attachments")
  }

  return responseMsg(1, 200, "post uploaded successfully")
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