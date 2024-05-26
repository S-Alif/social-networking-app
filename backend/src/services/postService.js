const postModel = require('../models/postModel');
const attachmentModel = require('../models/postAttachmentModel');
const friendshipModel = require('../models/friendshipModel');
const { responseMsg } = require('../utils/helpers');
const { deleteFiles, attachmentUploader } = require('../utils/postAttachmentUploader');

const ObjectID = require('mongoose').Types.ObjectId

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
        return fileArray.map(file => attachmentUploader(file))
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
  let result = await postModel.updateOne({ _id: new ObjectID(req.body?.id), author: req.headers?.id }, {caption: req.body?.caption})
  return responseMsg(1, 200, "post updated")
}

// delete post
exports.deletePost = async (req) => {
  let postAttachments = await attachmentModel.find({ postId: req.params?.id }).select('fileLocation -_id').lean()
  
  if(postAttachments){
    let attachmentArray = postAttachments.map(attachment => attachment.fileLocation)

    // delete the attachments
    await deleteFiles(attachmentArray)
    
    // delete attachments data form database
    await attachmentModel.deleteMany({ postId: req.params?.id })
  }

  // finally delete the posts
  await postModel.deleteOne({ _id: new ObjectID(req.params?.id) })

  return responseMsg(1, 200, "post deleted")
}

// get a single post
exports.getSinglePost = async (req) => {

  // stages of aggregation
  let matchStage = { $match: { _id: new ObjectID(req.params?.id) } }
  let lookUpStage = {
    $lookup: {
      from: 'postattachments',
      localField: '_id',
      foreignField: 'postId',
      as: 'attachments'
    }
  }
  let unwindStage = { $unwind: { path: '$attachments', preserveNullAndEmptyArrays: true } }

  // get the data
  let post = await postModel.aggregate([ matchStage, lookUpStage ])

  return responseMsg(1, 200, post[0])
}

// get a lot of posts
exports.getLotOfPosts = async (req) => {

  // page, limit and requesting user
  const page = parseInt(req.params?.page)
  const limit = parseInt(req.params?.limit)
  const skip = (page - 1) * limit

  const currentUser = new ObjectID(req.headers?.id)

  // Fetch friends of the current user
  const friendships = await friendshipModel.find({
    $or: [{ user1: currentUser }, { user2: currentUser }]
  }).exec()

  const friendIds = friendships.map(f =>
    f.user1.equals(currentUser) ? f.user2 : f.user1
  )

  // aggregation stages
  let authorDetailStage = {
    $lookup: {
      from: 'users',
      localField: 'author',
      foreignField: '_id',
      as: 'authorDetails'
    }
  }

  let unwindAuthorDetails = { $unwind: '$authorDetails' }

  let privacyModeFilter = {
    $match: {
      $and: [
        {
          $or: [
            { 'authorDetails.privacy': 'public' },
            { 'authorDetails._id': currentUser },
            {
              $and: [
                { 'authorDetails.privacy': 'friends' },
                { 'authorDetails._id': { $in: friendIds } }
              ]
            }
          ]
        },
        { 'postType': 'normal' }
      ]
    }
  }

  let joinAttachments = {
    $lookup: {
      from: 'postattachments',
      localField: '_id',
      foreignField: 'postId',
      as: 'attachments'
    }
  }

  let currentUserReaction = {
    $lookup: {
      from: 'reactions',
      let: { postId: '$_id', userId: currentUser },
      pipeline: [
        { $match: { $expr: { $and: [{ $eq: ['$reactedOn', '$$postId'] }, { $eq: ['$author', '$$userId'] }] } } },
        { $project: { _id: 0, reaction: 1 } }
      ],
      as: 'currentUserReaction'
    }
  }

  let addCurrentUserReactionField = {
    $addFields: {
      currentUserReaction: { $arrayElemAt: ['$currentUserReaction.reaction', 0] }
    }
  }


  let sortStage = { $sort: { createdAt: -1 } }
  let skipStage = { $skip: skip }
  let limitStage = { $limit: limit }

  let projectStage = {
    $project: {
      _id: 1,
      author: 1,
      caption: 1,
      reactionCount: { $ifNull: ['$reactionCount', 0] },
      commentCount: { $ifNull: ['$commentCount', 0] },
      postType: 1,
      reports: 1,
      createdAt: 1,
      updatedAt: 1,
      attachments: 1,
      currentUserReaction: 1,
      'authorDetails.firstName': 1,
      'authorDetails.lastName': 1,
      'authorDetails.profileImg': 1
    }
  }


  // fetch the posts
  let posts = await postModel.aggregate([
    authorDetailStage,
    unwindAuthorDetails,
    privacyModeFilter,
    currentUserReaction,
    addCurrentUserReactionField,
    sortStage,
    skipStage,
    limitStage,
    joinAttachments,
    projectStage
  ]);

  return responseMsg(1, 200, posts);
}

// report a post
exports.reportPost = async (req) => {

}