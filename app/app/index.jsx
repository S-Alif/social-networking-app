import { View, Text, SafeAreaView, ImageBackground, Image } from 'react-native'
import React, { useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'

import logo3 from '../assets/images/connect_vive_logo_3.png'
import { StatusBar } from 'expo-status-bar'
import authStore from '../constants/authStore'
import { router } from 'expo-router'

const Index = () => {

  const { setToken } = authStore()

  // route based on token
  useEffect(() => {
    (async () => {
      let token = await SecureStore.getItemAsync('token') || null
      if (!token) router.push('/login')
    })()
  }, [])

  return (
    <SafeAreaView className="flex-1">
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
        className="flex-1 w-[100%] h-[100%]"
        blurRadius={5}
      >
        <View className="flex-1 justify-center items-center" style={{ backgroundColor: "rgba(255,255,255,0.8)" }}>

          <Image source={logo3} resizeMode='contain' className="w-[150px] h-[150px]" />
          <Text className="font-pbold text-3xl mt-10">
            Connect
            <Text className="text-purpleColor">Vibe</Text>
          </Text>

        </View>
      </ImageBackground>

      <StatusBar style="dark" />
    </SafeAreaView>
  )
}

export default Index