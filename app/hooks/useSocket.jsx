import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import * as Notifications from 'expo-notifications';
import { url } from '../scripts/endpoints';
import * as SecureStore from 'expo-secure-store'
import authStore from '../constants/authStore';
import { customAlert } from '../scripts/alerts';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

const useSocket = () => {

  const { notificationCount, setNotificationCount, socketConnected, setSocketConnection } = authStore()
  const [count, setCount] = useState(notificationCount)

  useEffect(() => {
    setNotificationCount(count)
  }, [count])

  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== 'granted') {
        customAlert("ERROR !!", "Failed to get notification permission")
        return
      }
    })()
  }, [])

  // initialize socket connection
  useEffect(() => {
    const initializeSocket = async () => {
      const token = await SecureStore.getItemAsync('token') || null
      const socket = io(url, {
        auth: {
          token,
        },
        transports: ['websocket']
      })

      socket.on('connect', () => {
        console.log('Connected to socket.io server')
        setSocketConnection(true)
      })

      // for push notification
      socket.on('notification', async (notification) => {
        setCount(notificationCount + 1) // increase notification count
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'New Notification',
            body: `You have a new ${notification[0].postType} notification`,
          },
          trigger: {
            seconds: 1 // trigger notification after 1 second
          },
        })
      })

      socket.on('disconnect', () => {
        customAlert("ERROR!!", "Disconnected from server. Please re-open the app")
      })

      // Clean up the effect
      return () => {
        socket.disconnect()
      }
    }

    initializeSocket()
  }, [])
}

export default useSocket