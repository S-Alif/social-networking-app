const { Server } = require('socket.io')
const { verifyToken } = require('./src/utils/helpers')
const notificationModel = require('./src/models/notificationModel')
const msgModel = require('./src/models/messageModel')
const { setSocketInstance } = require('./src/socketManager/socketManager')
const ObjectID = require('mongoose').Types.ObjectId

module.exports = (server) => {

  let connectedUsers = {}

  // find socketId to check if user is connected and also to emit the notification
  const findSocketId = (userId) => {
    let connected = Object.keys(connectedUsers).find(key => connectedUsers[key] === userId)
    if(!connected) return null
    return connected
  }
  
  const io = new Server(server, {
    cors: {
      origin: "*",
      credentials: true,
    },
  })

  // Authenticate user
  const authenticateUser = (socket, next) => {
    try {
      let token = socket.handshake?.auth?.token
      if (!token) return next(new Error('Unauthorized'))

      let decoded = verifyToken(token)
      if (decoded && decoded.id) {
        socket.user = decoded.id
        connectedUsers[socket.id] = decoded.id
        next()
      } else {
        return
      }
    } catch (error) {
      return
    }
  }

  // Use the authentication function
  io.use(authenticateUser)

  // After successful connection
  io.on('connection', (socket) => {

    socket.on('disconnect', () => {
      delete connectedUsers[socket.id]
    })

    socket.on('start-call', (data) => {
      let connectedUserSocketId = findSocketId(data.to)
      if (connectedUserSocketId) {
        io.to(connectedUserSocketId).emit('offer', {
          offer: data.offer,
          from: socket.user,
        })
      }
    })

    socket.on('answer', (data) => {
      let connectedUserSocketId = findSocketId(data.to)
      if (connectedUserSocketId) {
        io.to(connectedUserSocketId).emit('answer', {
          answer: data.answer,
          from: socket.user,
        })
      }
    })

    socket.on('end-call-confirm', (data) => {
      let connectedUserSocketId = findSocketId(data.to)
      console.log("from : "+socket.user, "to: "+data?.to)
      if (connectedUserSocketId) {
        io.to(connectedUserSocketId).emit('end-call', {to: data.to})
      }
    })

    socket.on('candidate', (data) => {
      let connectedUserSocketId = findSocketId(data.to)
      if (connectedUserSocketId) {
        io.to(connectedUserSocketId).emit('candidate', {
          candidate: data.candidate,
          from: socket.user,
        })
      }
    })

  })

  // listen to notification changes
  let notificationStream = notificationModel.watch()
  notificationStream.on('change', async (change) => {
    if(change.operationType !== "insert") return
    let newNotificationDocument = change.fullDocument
    let connectedUserSocketId = findSocketId(newNotificationDocument?.notificationTo.toString())
    if (!connectedUserSocketId) return

    let notificaitons = await notificationModel.aggregate([
      { $match: { notificationTo: new ObjectID(newNotificationDocument?.notificationTo.toString()) } },
      {$sort: {createdAt: -1}},
      {$limit: 1},
      {
        $lookup: {
          from: "users",
          localField: "notificationFrom",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 1,
          "userId": "$user._id",
          "firstName": "$user.firstName",
          "lastName": "$user.lastName",
          "profileImg": "$user.profileImg",
          type: 1,
          seen: 1,
          postType: 1,
          postId: 1,
          createdAt: 1
        }
      }
    ])

    // send the notification to the designated user
    io.to(connectedUserSocketId).emit('notification', notificaitons)
  })

  setSocketInstance(io, findSocketId)
}