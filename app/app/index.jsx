import React, { useEffect } from 'react'
import { Text, Image } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import logo3 from '../assets/images/connect_vive_logo_3.png'
import { router } from 'expo-router'
import AuthTabScreen from '../components/authTabScreen'
import authStore from '../constants/authStore'
import { customAlert } from '../scripts/alerts'
import * as Notifications from 'expo-notifications';

const Index = () => {

  const { fetchProfile, setToken } = authStore()

  // ask notification permission if no have it
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync()
      if (status !== 'granted') {
        customAlert("Warning !!", "Notification permission needed for live notifications")
        return
      }
    })()
  }, [])

  // route based on token
  useEffect(() => {
    (async () => {
      let token = await SecureStore.getItemAsync('token') || null
      if (!token) {
        router.replace('/login')
        return
      }

      let result = await fetchProfile()
      if (result) {
        setToken(token)
        return router.replace('/home')
      }
      router.replace('/login')
    })()
  }, [])


  return (
    <AuthTabScreen
      containerStyles={"justify-center items-center"}
    >
      <Image source={logo3} resizeMode='contain' className="w-[150px] h-[150px]" />
      <Text className="font-pbold text-3xl mt-10">
        Connect
        <Text className="text-purpleColor">Vibe</Text>
      </Text>
    </AuthTabScreen>
  )
}

export default Index