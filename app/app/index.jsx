import React, { useEffect } from 'react'
import { View, Text, SafeAreaView, ImageBackground, Image } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import logo3 from '../assets/images/connect_vive_logo_3.png'
import { router } from 'expo-router'
import AuthTabScreen from '../components/authTabScreen'
import { userUrl } from '../scripts/endpoints'
import authStore from '../constants/authStore'
import api from '../scripts/api'
import { dataFetcher } from '../scripts/apiCaller'

const Index = () => {

  const {setProfile} = authStore()

  // route based on token
  useEffect(() => {
    setTimeout(async () => {
      let token = await SecureStore.getItemAsync('token') || null
      if (!token) {
        router.replace('/login')
        return
      }
      
      let result = await dataFetcher(userUrl + '/profile')
      if (result != null) {
        setProfile(result?.data)
        return router.replace('/home')
      }
      setProfile(null)
    }, 2000)
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