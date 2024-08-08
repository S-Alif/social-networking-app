// socketService.js
import io from 'socket.io-client';
import * as Notifications from 'expo-notifications';
import { url } from '../scripts/endpoints';
import { customAlert } from '../scripts/alerts';

let socket;

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
    socket.on('notification', async (notification) => {
      setNotificationCount(notificationCount + 1)
      setNewNotification([...notifications, ...notification])

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'New Notification',
          body: `You have a new ${notification[0].postType} notification`,
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