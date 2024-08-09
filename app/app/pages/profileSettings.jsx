import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Checkbox from 'expo-checkbox'
import authStore from './../../constants/authStore';
import { dataSender } from '../../scripts/apiCaller';
import { userUrl } from './../../scripts/endpoints';
import CustomButton from './../../components/CustomButton';
import * as SecureStore from 'expo-secure-store'
import UpdatePass from '../../components/updatePass';
import { disconnectSocket } from '../../constants/socketConnection';

const ProfileSettings = () => {

  const { setProfile, setSocketConnection } = authStore()

  // logout user
  const logout = async () => {
    await SecureStore.deleteItemAsync('token')
    setProfile(null)
    disconnectSocket(setSocketConnection)
  }

  return (
    <View className="flex-1 bg-lightGrayColor">
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 20,
          paddingHorizontal: 8
        }}
      >
        <View className="flex-1">
          {/* privacy update */}
          <PrivacyCheckBox />

          {/* password update */}
          <View className="flex-1 pt-10">
            <UpdatePass />
          </View>

          {/* logout */}
          <CustomButton
            title={"Logout"}
            containerStyles={"flex-1 w-full h-[50] bg-redColor mt-5"}
            textStyles={"text-white font-psemibold text-xl"}
            handlePress={logout}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default ProfileSettings


// privacy checkbox
const PrivacyCheckBox = () => {

  const { profile } = authStore()
  const [boxValue, setBoxValue] = useState("")

  // set the box value
  useEffect(() => {
    setBoxValue(profile?.privacy)
  }, [])

  const updateAccount = async (checkboxValue) => {
    let result = await dataSender(userUrl + "/update", { _id: profile?._id, privacy: checkboxValue })
    if (result == null || result?.status == 0) return
    setBoxValue(checkboxValue)
  }


  return (
    <View className="flex-1 pt-4">
      <Text className="font-psemibold text-2xl pb-2 border-b-2 border-b-gray-400 mb-3">Account privacy</Text>

      <View className="flex-1 flex-row mb-3">
        <Checkbox value={boxValue == "public"} onValueChange={() => updateAccount("public")} />
        <Text className="font-pmedium text-xl pl-3">Public</Text>
      </View>
      <View className="flex-1 flex-row mb-3">
        <Checkbox value={boxValue == "private"} onValueChange={() => updateAccount("private")} />
        <Text className="font-pmedium text-xl pl-3">Private</Text>
      </View>
      <View className="flex-1 flex-row mb-3">
        <Checkbox value={boxValue == "friends"} onValueChange={() => updateAccount("friends")} />
        <Text className="font-pmedium text-xl pl-3">Friends</Text>
      </View>
    </View>
  )
}