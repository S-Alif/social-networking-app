import { View, Text, SafeAreaView, ImageBackground, Image } from 'react-native'
import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { BlurView } from 'expo-blur'
import * as SecureStore from 'expo-secure-store';

import logo3 from '../assets/images/connect_vive_logo_3.png'

const App = () => {

  return (
    <>
      <SafeAreaView className="bg-lightGrayColor2 flex-1">
        <View className="flex-1 h-screen">

          {/* background image */}
          <ImageBackground
            source={{ uri: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}
            className="flex-1"
          >
            <BlurView intensity={150} className="w-screen h-screen flex-1 justify-center items-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
              
              <Image source={logo3} resizeMode='contain' className="w-[150px] h-[150px]" />
              <Text className="font-pbold text-3xl pt-8">Connect<Text className="text-purpleColor">Vibe</Text></Text>

            </BlurView>
          </ImageBackground>

        </View>
      </SafeAreaView>
      <StatusBar animated={true} style='dark' />
    </>
  )
}

export default App