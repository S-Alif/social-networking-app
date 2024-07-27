import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import * as Notifications from 'expo-notifications';
import { url } from '../scripts/endpoints';
import * as SecureStore from 'expo-secure-store'
import authStore from '../constants/authStore';
import { customAlert } from '../scripts/alerts';

const useSocket = () => {

  const { notificationCount, setNotificationCount } = authStore()
  const [count, setCount] = useState(notificationCount)

  useEffect(() => {
    setNotificationCount(count)
  }, [count])

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
      })

      // for push notification
      socket.on('notification', (notification) => {
        setCount(prev => prev+1) // increase notification count
        Notifications.scheduleNotificationAsync({
          content: {
            title: 'New Notification',
            body: `You have a new ${notification[0].postType} notification`,
          },
          trigger: 1, // trigger notification immediately
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