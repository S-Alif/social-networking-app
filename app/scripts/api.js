// api.js
import axios from 'axios';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store'

const api = axios.create({
  baseURL: 'http://192.168.0.103:10010', 
  timeout: 10000,
})

// Add a response interceptor
api.interceptors.response.use(
  response => {
    if (response.data.status === 0) {
      Alert.alert('ERROR!!', response.data.data)
      return null
    }
    return response.data
  },
  error => {
    if (error.response && error.response.status === 401) {
      
      Alert.alert('Session Expired', 'Your session has expired. Please log in again.', [
        {
          text: 'OK',
          onPress: async () => {
            await SecureStore.deleteItemAsync('token')
            router.replace('/login')
          },
        },
      ])
    }
    return Promise.reject(error)
  }
)

export default api