import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import authStore from './../constants/authStore';
import logo3 from "../assets/images/connect_vive_logo_3.png"
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const TabScreenLayout = ({ children }) => {

  const { profile, notificationCount, getNotification } = authStore()
  const [notification, setNotification] = useState(0)

  useEffect(() => {
    (async () => await getNotification())()
  }, [])

  useEffect(() => {
    setNotification(notificationCount)
  }, [notificationCount])

  return (
    <SafeAreaView className="flex-1 bg-lightGrayColor2">

      {/* show profile icons */}
      <View className="flex-1 max-h-[80px] justify-between items-center bg-lightGrayColor2 flex-row mt-6 px-4 border-b-2 border-b-gray-300">

        {/* user image */}
        <TouchableOpacity onPress={() => router.push('pages/profile')}>
          <Image source={{ uri: profile?.profileImg }} className="w-[50px] h-[50px] rounded-full" />
        </TouchableOpacity>

        {/* logo */}
        <View className="w-[50px] h-[50px] overflow-hidden">
          <Image source={logo3} className="w-full h-full" resizeMode='contain' />
        </View>

        {/* bell icon for notification */}
        <TouchableOpacity
          onPress={() => router.push('/notifications')}
          className="relative"
        >
          <AntDesign name="bells" size={24} color="black" />
          {
            notification > 0 &&
            <View className="absolute bg-redColor rounded p-[2] top-[-10] left-1/2"><Text className="text-sm font-psemibold text-white px-1">{notification}</Text></View>
          }
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