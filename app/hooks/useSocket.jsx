import { useEffect } from 'react';
import io from 'socket.io-client';
// import * as Notifications from 'expo-notifications';
import { url } from '../scripts/endpoints';
import * as SecureStore from 'expo-secure-store'

const useSocket = () => {
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

      // socket.on('new-notification', (notification) => {
      //   Notifications.scheduleNotificationAsync({
      //     content: {
      //       title: 'New Notification',
      //       body: `You have a new ${notification.type}`,
      //     },
      //     trigger: null, // trigger notification immediately
      //   })
      // })

      socket.on('disconnect', () => {
        console.log('Disconnected from socket.io server')
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