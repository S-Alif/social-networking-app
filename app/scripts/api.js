// api.js
import axios from 'axios';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store'

const api = axios.create({
  baseURL: 'http://192.168.0.103:10010',
  timeout: 120000,
})

// Add a request interceptor
api.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  response => {
    if (response.data.code === 401 || response.data.code === 500) {
      Alert.alert('Session Expired', 'Your session has expired. Please log in again.', [
        {
          text: 'OK',
          onPress: async () => {
            await SecureStore.deleteItemAsync('token')
            router.replace('/login')
          },
        },
      ])
      return Promise.reject(new Error('Session expired'))
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
    return Promise.reject(new Error('Session expired'))
  }
)

export default api