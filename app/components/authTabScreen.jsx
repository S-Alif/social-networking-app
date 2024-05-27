import { View, Text, SafeAreaView, ImageBackground } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const AuthTabScreen = ({children, imageUrl, containerStyles}) => {

  let defaultUrl = "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

  return (
    <SafeAreaView className="flex-1">
      <ImageBackground
        source={{ uri: imageUrl ? imageUrl : defaultUrl }}
        className="flex-1 w-[100%] h-[100%]"
        blurRadius={5}
      >
        <View className={`flex-1 ${containerStyles ? containerStyles : ""} px-4`} style={{ backgroundColor: "rgba(255,255,255,0.8)" }}>

          {
            children ? children : <Text className="text-2xl font-pmedium">Please pass other code as children</Text>
          }

        </View>
      </ImageBackground>

      <StatusBar style="dark" />
    </SafeAreaView>
  )
}

export default AuthTabScreen