import { View, Text, ImageBackground } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context';

const AuthTabScreen = ({children, imageUrl, containerStyles}) => {

  let defaultUrl = "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

  return (
    <ImageBackground
      source={{ uri: imageUrl ? imageUrl : defaultUrl }}
      className="flex-1 w-[100%] h-[100%]"
      blurRadius={10}
    >
      <View className="flex-1 px-4" style={{ backgroundColor: "rgba(255,255,255,0.6)" }}>
        <SafeAreaView className="flex-1">
          <View className={`flex-1 ${containerStyles ? containerStyles : ""}`}>
            {
              children ? children : <Text className="text-2xl font-pmedium">Please pass other code as children</Text>
            }
          </View>
        </SafeAreaView>
      </View>
      
      <StatusBar style="dark" />
    </ImageBackground>
    
  )
}

export default AuthTabScreen