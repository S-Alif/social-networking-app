import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import { Entypo, FontAwesome5 } from '@expo/vector-icons'
import { dataSender } from '../scripts/apiCaller'
import { engageMentUrl, userUrl } from '../scripts/endpoints'
import CustomButton from './CustomButton'
import authStore from './../constants/authStore';

const FriendListCard = ({ data, type, aceepted, rejected, unfriend, listType }) => {

  const { profile } = authStore()

  // unfriend
  const removeFriend = () => {
    Alert.alert("Don't want to be buddies any more 😭 ?", "Remove buddy", [
      {
        text: "No"
      },
      {
        text: "Yes",
        onPress: async () => {
          let result = await dataSender(userUrl + "/friends/remove/" + data?._id)
          if (result != null && result?.status == 1) unfriend(data?._id)
        }
      }
    ])
  }

  // request confirmation
  const confirmRequest = async (confirmation) => {
    let result = await dataSender(engageMentUrl + "/confirm-request", { user: data?._id, accepted: confirmation })
    if (result !== null && result?.status == 1) {
      if (confirmation) return aceepted(data)
      rejected(data?._id)
    }
  }

  // confirm altert
  const showAlert = async () => {
    Alert.alert("Become buddies ☺", "Aceept request", [
      {
        text: "Cancel"
      },
      {
        text: "No",
        onPress: async () => { await confirmRequest(false) }
      },
      {
        text: "Yes",
        onPress: async () => { await confirmRequest(true) }
      }
    ])
  }

  return (
    <View className="flex-1 bg-lightGrayColor2 px-2 py-3 rounded-md mb-2 flex-row justify-between items-center" style={{ shadowColor: "rgba(0,0,0,0.6)", shadowOffset: 3, elevation: 4 }}>
      <TouchableOpacity
        className="flex-1 h-full flex-row gap-3 items-center"
        onPress={() => router.push({
          pathname: profile?._id == data?._id ? "pages/profile" : "pages/userProfileById",
          params: { userId: data?._id }
        })}
      >
        <View>
          <Image source={{ uri: data?.profileImg }} className="w-[60px] h-[60px] rounded-full" />
        </View>

        <View>
          <Text className="text-xl font-pmedium">{data?.firstName} {data?.lastName}</Text>
        </View>
      </TouchableOpacity>

      {/* option for current user */}
      {
        (type == 0 && listType == 0) &&
        <TouchableOpacity
          className=""
          onPress={removeFriend}
        >
          <Entypo name="dots-three-vertical" size={20} color="black" />
        </TouchableOpacity>
      }

      {/* accept or remove a friend */}
      {
        (type == 0 && listType == 1) &&
        <CustomButton
          title={<FontAwesome5 name="user-cog" size={30} color="white" />}
          containerStyles={"bg-greenColor rounded-md py-2 w-[80] mx-auto h-[50]"}
          textStyles={"text-xl font-pmedium text-lightGrayColor2 text-center pt-2 pl-2"}
          handlePress={showAlert}
        />
      }
    </View>
  )
}

export default FriendListCard