import { View, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import authStore from './../constants/authStore';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const TabScreenLayout = ({ children }) => {

  const { profile, notificationCount, getNotification } = authStore()
  const [notification, setNotification] = useState(0)

  useEffect(() => {
    (async () => await getNotification(1, 20, true))()
  }, [])

  useEffect(() => {
    setNotification(notificationCount)
  }, [notificationCount])

  return (
    <SafeAreaView className="flex-1 bg-lightGrayColor2">

      {/* show profile icons */}
      <View className="flex-1 max-h-[70px] justify-between items-center bg-lightGrayColor2 flex-row mt-6 px-4 border-b-2 border-b-gray-300">

        {/* user image */}
        <TouchableOpacity onPress={() => router.push('pages/profile')}>
          <Image source={{ uri: profile?.profileImg }} className="w-[50px] h-[50px] rounded-full" />
        </TouchableOpacity>

        {/* logo */}
        <Text className="font-pbold text-[24px] text-primary">connect<Text className="text-purpleColor">Vive</Text></Text>

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