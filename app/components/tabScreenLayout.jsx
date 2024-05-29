import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import authStore from './../constants/authStore';
import logo3 from "../assets/images/connect_vive_logo_3.png"
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const TabScreenLayout = ({children}) => {

  const {profile} = authStore()

  return (
    <SafeAreaView className="flex-1 bg-lightGrayColor2">

      {/* show profile icons */}
      <View className="flex-1 max-h-[80px] justify-between items-center bg-lightGrayColor2 flex-row mt-6 px-4 border-b-2 border-b-gray-300">

        {/* user image */}
        <TouchableOpacity onPress={() => router.push('pages/profile')}>
          <Image source={{uri: profile?.profileImg}} className="w-[50px] h-[50px] rounded-full" />
        </TouchableOpacity>

        {/* logo */}
        <View className="w-[50px] h-[50px] overflow-hidden">
          <Image source={logo3} className="w-full h-full" resizeMode='contain' />
        </View>

        {/* bell icon for notification */}
        <TouchableOpacity>
          <AntDesign name="bells" size={24} color="black" />
        </TouchableOpacity>

      </View>

      {/* show the content from other components */}
      <View className="bg-lightGrayColor px-2 flex-1">
        {children ? children : <Text className="font-psemibold text-2xl">Please pass the codes as children here</Text>}
      </View>

      <StatusBar style="dark" />
    </SafeAreaView>
  )
}

export default TabScreenLayout