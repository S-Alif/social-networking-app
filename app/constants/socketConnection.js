// socketService.js
import io from 'socket.io-client';
import * as Notifications from 'expo-notifications';
import { url } from '../scripts/endpoints';
import { customAlert } from '../scripts/alerts';

let socket;

// notification msg
const msgs = {
  postReaction: "reacted on your post",
  postComment: "commented on your post",
  reelsReaction: "reacted on your threel",
  reelsComment: "commented on your threel",
  reuqest: "wants to become your buddy",
  requestAccept: "has accepted you as a buddy",
}

// set the notification msg
const setMsg = (notification) => {
  if (notification?.type == "comment" && notification?.postType == "post") return msgs.postComment
  if (notification?.type == "reaction" && notification?.postType == "post") return msgs.postReaction
  if (notification?.type == "comment" && notification?.postType == "reels") return msgs.reelsComment
  if (notification?.type == "reaction" && notification?.postType == "reels") return msgs.reelsReaction
  if (notification?.type == "request") return msgs.reuqest
  if (notification?.type == "request_accept") return msgs.requestAccept
}

// set notification title
const setNotificationTitle = (notification) => {
  if (notification?.type == "comment" && notification?.postType == "post") return "Comment on your post"
  if (notification?.type == "reaction" && notification?.postType == "post") return "Reaction on your post"
  if (notification?.type == "comment" && notification?.postType == "reels") return "Comment on your threels"
  if (notification?.type == "reaction" && notification?.postType == "reels") return "Reaction on your threels"
  if (notification?.type == "request") return "Friend request"
  if (notification?.type == "request_accept") return "Friend request accepted"
}

// set notification data
const setNotificationData = (notification) => {
  if (notification?.postType == "post") return { pathname: "pages/SinglePost", params: { postId: notification?.postId } }
  if (notification?.postType == "reels") return { pathname: "/reels", params: { reelsId: notification?.postId } }
  if (notification?.postType == "request") return { pathname: "pages/userProfileById", params: { userId: notification?.userId } }
}

// notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export const connectSocket = (token, increaseNotificationCount, socketConnected, setSocketConnection, setNewNotification, setNewMsgStatus) => {

  socket = io(url, {
    auth: { token },
    transports: ['websocket'],
  })

  // connect to socket
  socket.on('connect', () => {
    setSocketConnection(true)
    console.log('Socket connected')
  })

  // live notification
  socket.on('notification', async (newNotification) => {
    increaseNotificationCount()
    setNewNotification(newNotification)

    let message = `${newNotification[0]?.firstName} ${newNotification[0]?.lastName} ${setMsg(newNotification[0])}`
    let data = setNotificationData(newNotification[0])

    await Notifications.scheduleNotificationAsync({
      content: {
        title: setNotificationTitle(newNotification[0]),
        body: message,
        data: data
      },
      trigger: {
        seconds: 1,
      },
    })
  })

  // check for new message arrival
  socket.on('new-message', (data) => {
    setNewMsgStatus(true)
  })

  socket.on('disconnect', (reason) => {
    if (!socketConnected) return
    if (reason === "io server disconnect") {
      socket.connect()
    }
    customAlert('ERROR!!', 'Disconnected from server. Please re-open the app')
    console.log('Socket disconnected')
  })
}

// disconnect from server
export const disconnectSocket = (setSocketConnection) => {
  socket = null
  setSocketConnection(false)
}

export const getSocket = () => socket