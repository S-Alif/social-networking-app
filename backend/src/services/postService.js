const postModel = require('../models/postModel');
const reactionModel = require('../models/reactionModel');
const commentModel = require('../models/commentModel');
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
  let result = await postModel.updateOne({ _id: new ObjectID(req.body?.id), author: req.headers?.id }, { caption: req.body?.caption })
  return responseMsg(1, 200, "post updated")
}

// delete post
exports.deletePost = async (req) => {

  if (req.params?.user != req.headers.id) return responseMsg(0, 200, "Go and delete your own posts")

  let postAttachments = await attachmentModel.find({ postId: req.params?.id }).select('fileLocation -_id').lean()
  if (postAttachments) {
    let attachmentArray = postAttachments.map(attachment => attachment.fileLocation)

    // delete the attachments
    await deleteFiles(attachmentArray)
    // delete attachments data form database
    await attachmentModel.deleteMany({ postId: req.params?.id })
  }

  // finally delete the posts
  await postModel.deleteOne({ _id: new ObjectID(req.params?.id) })
  await reactionModel.deleteMany({ reactedOn: new ObjectID(req.params?.id) })
  await commentModel.deleteMany({ commentOn: new ObjectID(req.params?.id) })
  return responseMsg(1, 200, "post deleted")
}

// get a single post
exports.getSinglePost = async (req) => {

  const currentUser = new ObjectID(req.headers?.id)

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
  let authorDetailStage = {
    $lookup: {
      from: 'users',
      localField: 'author',
      foreignField: '_id',
      as: 'authorDetails'
    }
  }

  let unwindAuthorDetails = { $unwind: '$authorDetails' }
  let currentUserReaction = {
    $lookup: {
      from: 'reactions',
      let: { postId: '$_id', userId: currentUser },
      pipeline: [
        { $match: { $expr: { $and: [{ $eq: ['$reactedOn', '$$postId'] }, { $eq: ['$author', '$$userId'] }] } } },
        { $project: { _id: 1, reaction: 1 } }
      ],
      as: 'currentUserReaction'
    }
  }

  let uwindCurrentUserReaction = { $unwind: { path: '$currentUserReaction', preserveNullAndEmptyArrays: true } }
  let unwindStage = { $unwind: { path: '$attachments', preserveNullAndEmptyArrays: true } }
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

  // get the data
  let post = await postModel.aggregate([matchStage, lookUpStage, authorDetailStage, unwindAuthorDetails, currentUserReaction, uwindCurrentUserReaction, projectStage])

  return responseMsg(1, 200, post[0])
}

// get a lot of posts
exports.getLotOfPosts = async (req) => {

  let postType = req.params?.type
  if (!postType) return responseMsg(0, 200, "Post type not found")

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
        { 'postType': postType }
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
        { $project: { _id: 1, reaction: 1 } }
      ],
      as: 'currentUserReaction'
    }
  }

  let uwindCurrentUserReaction = { $unwind: { path: '$currentUserReaction', preserveNullAndEmptyArrays: true } }


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


  let posts = await postModel.aggregate([
    authorDetailStage,
    unwindAuthorDetails,
    privacyModeFilter,
    {
      $facet: {
        posts: [
          sortStage,
          skipStage,
          limitStage,
          currentUserReaction,
          uwindCurrentUserReaction,
          joinAttachments,
          projectStage
        ],
        totalCount: [{ $count: 'totalCount' }, { $unwind: '$totalCount' }]
      }
    }
  ])

  const { posts: paginatedPosts, totalCount } = posts[0]

  return responseMsg(1, 200, { totalCount: totalCount[0].totalCount ? totalCount[0].totalCount : 0, posts: paginatedPosts })
}

// get post by user
exports.getPostByUser = async (req) => {

  let author = req.params?.user
  if (!author) author = req.headers?.id
  let postType = req.params?.type
  if (!postType) return responseMsg(0, 200, "No post type found")

  const page = parseInt(req.params?.page)
  const limit = parseInt(req.params?.limit)
  const skip = (page - 1) * limit

  // stages of aggregation
  let matchStage = { $match: { author: new ObjectID(author), postType: postType } }
  let sortStage = { $sort: { createdAt: -1 } }
  let skipStage = { $skip: skip }
  let limitStage = { $limit: limit }
  let authorDetailStage = {
    $lookup: {
      from: 'users',
      localField: 'author',
      foreignField: '_id',
      as: 'authorDetails'
    }
  }
  let lookUpStage = {
    $lookup: {
      from: 'postattachments',
      localField: '_id',
      foreignField: 'postId',
      as: 'attachments'
    }
  }
  let unwindAuthorDetails = { $unwind: '$authorDetails' }
  let currentUserReaction = {
    $lookup: {
      from: 'reactions',
      let: { postId: '$_id', userId: new ObjectID(req.headers?.id) },
      pipeline: [
        { $match: { $expr: { $and: [{ $eq: ['$reactedOn', '$$postId'] }, { $eq: ['$author', '$$userId'] }] } } },
        { $project: { _id: 1, reaction: 1 } }
      ],
      as: 'currentUserReaction'
    }
  }

  let uwindCurrentUserReaction = { $unwind: { path: '$currentUserReaction', preserveNullAndEmptyArrays: true } }

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

  let unwindStage = { $unwind: { path: '$attachments', preserveNullAndEmptyArrays: true } }

  // get the data
  let posts = await postModel.aggregate([
    matchStage,
    sortStage,
    skipStage,
    limitStage,
    {
      $facet: {
        posts: [
          authorDetailStage,
          unwindAuthorDetails,
          currentUserReaction,
          uwindCurrentUserReaction,
          lookUpStage,
          projectStage
        ],
        totalCount: [{ $count: 'totalCount' }, { $unwind: '$totalCount' }]
      }
    }
  ])

  const { posts: paginatedPosts, totalCount } = posts[0]

  return responseMsg(1, 200, { totalCount: totalCount[0]?.totalCount, posts: paginatedPosts })
}

// get friend and post amounts
exports.getFriendsAndPostAmount = async (req) => {
  let user = req.params?.user
  if (!user) user = req.headers?.id


  let friends = await await friendshipModel.find({
    $or: [
      { user1: new ObjectID(user) },
      { user2: new ObjectID(user) }
    ]
  }).count('total')

  let posts = await postModel.find({ author: new ObjectID(user) }).count('total')

  return responseMsg(1, 200, { friends, posts })
}

// report a post
exports.reportPost = async (req) => {

}