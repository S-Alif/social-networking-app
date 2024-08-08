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

const setNotificationTitle = (notification) => {
  if (notification?.type == "comment" && notification?.postType == "post") return "Comment on your post"
  if (notification?.type == "reaction" && notification?.postType == "post") return "Reaction on your post"
  if (notification?.type == "comment" && notification?.postType == "reels") return "Comment on your reels"
  if (notification?.type == "reaction" && notification?.postType == "reels") return "Reaction on your reels"
  if (notification?.type == "request") return "Friend request"
  if (notification?.type == "request_accept") return "Friend request accepted"
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

export const connectSocket = (token, notificationCount, setNotificationCount, socketConnected, setSocketConnection, notifications, setNewNotification) => {

  if (!socket) {
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
      setNotificationCount(notificationCount + 1)
      setNewNotification([...newNotification, ...notifications])

      let message = `${newNotification[0]?.firstName} ${newNotification[0]?.lastName} ${setMsg(newNotification[0])}`
      console.log(newNotification[0]?.postType)

      await Notifications.scheduleNotificationAsync({
        content: {
          title: setNotificationTitle(newNotification[0]),
          body: message,
        },
        trigger: {
          seconds: 1,
        },
      })
    })

    socket.on('disconnect', () => {
      if(!socketConnected) return
      customAlert('ERROR!!', 'Disconnected from server. Please re-open the app')
      console.log('Socket disconnected')
    })

  }
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket