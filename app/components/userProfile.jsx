import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, router, useLocalSearchParams, usePathname } from 'expo-router'
import { Feather, Entypo } from '@expo/vector-icons';
import { dataFetcher } from './../scripts/apiCaller';
import { postUrl, userUrl } from '../scripts/endpoints';
import { formatDate } from '../scripts/dateFormatter';
import authStore from '../constants/authStore';
import CustomButton from './CustomButton';
import ShowUserPosts from './showUserPosts';
import ShowUserThreels from './showUserThreels';

const UserProfile = () => {

  const { userId } = useLocalSearchParams()
  const pathname = usePathname()
  const isProfilePath = pathname == '/pages/profile'

  const { profile } = authStore()

  const [userData, setUserData] = useState(null)
  const [amount, setAmount] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState(1)


  // fetch data
  useEffect(() => {
    (async () => {
      var user
      if (!isProfilePath) {
        user = await dataFetcher(userUrl + '/profile/' + userId)
        if (user != null && user?.status != 0) setUserData(user?.data)
      } else {
        user = profile
        setUserData(user)
      }

      // fetch post and profile amount datas based on privacy
      if (isProfilePath || (user?.data?.privacy == "public" || user?.data.isFriends == true)) {
        let userAmounts = await dataFetcher(`${postUrl}/amounts/user/${!isProfilePath ? user?.data?._id : profile?._id}`)
        if (userAmounts != null && userAmounts?.status != 0) setAmount(userAmounts?.data)
      }
    })()
  }, [])



  return (
    <View className="flex-1 bg-lightGrayColor">

      {/* rename the header title */}
      {
        pathname == "/pages/profile" ?
          <Stack.Screen options={{ headerTitle: "Profile" }} />
          : <Stack.Screen options={{ headerTitle: (userData?.firstName && userData?.lastName) ? `${userData?.firstName} ${userData?.lastName}` : "" }} />
      }


      {/* main profile */}
      <FlatList
        ListHeaderComponent={() => (
          <>
            {!loading &&
              <View className="flex-1 bg-lightGrayColor2">
                {/* profile images */}
                <View className="flex-1 w-full h-[250px] relative overflow-visible">
                  <Image source={{ uri: userData?.profileCover }} className="w-full h-[250px]" />

                  <View
                    className="w-[150px] h-[150px] z-10 absolute border-4 border-lightGrayColor2 rounded-full left-1/2 bottom-[-75px] overflow-hidden"
                    style={{ transform: [{ translateX: -75 }] }}
                  >
                    <Image source={{ uri: userData?.profileImg }} className="w-full h-full" />
                  </View>
                </View>

                {/* profile data */}
                <View className="flex-1 w-full px-4 pt-[60] pb-3">
                  <Text className="text-3xl font-pbold pt-2 mt-6 text-center">{userData?.firstName} {userData?.lastName}</Text>

                  {
                    (userData?.city || userData?.country) &&
                    <Text className="text-xl font-pmedium text-grayColor text-center pt-2">
                      {userData?.city ? userData?.city : ""}{userData?.city && userData?.country ? "," : ""} {userData?.country ? userData?.country : ""}
                    </Text>
                  }

                  <Text className="text-center pt-2 text-[16] font-pmedium text-gray-400"> Joined on {formatDate(userData?.createdAt)}</Text>
                </View>

                {/* buttons to redirect to profile setting and edit */}
                {
                  isProfilePath &&
                  <View className="py-4 justify-between items-center flex-row">
                    <View className="w-1/2 pl-2 pr-1">
                      <CustomButton
                        title={"Edit profile"}
                        containerStyles={"bg-grayColor rounded-md py-2 w-full h-[40]"}
                        textStyles={"text-xl font-pmedium text-lightGrayColor2"}
                        handlePress={() => router.push('pages/editProfile')}
                      />
                    </View>

                    <View className="w-1/2 pr-2 pl-1">
                      <CustomButton
                        title={"Settings"}
                        containerStyles={"bg-grayColor rounded-md py-2 w-full h-[40]"}
                        textStyles={"text-xl font-pmedium text-lightGrayColor2"}
                        handlePress={() => router.push('pages/profileSettings')}
                      />
                    </View>

                  </View>
                }

                {/* show amounts */}
                <View className="flex-1 flex-row justify-around items-center border-y-2 border-y-gray-300 py-4">

                  <View className="items-center w-1/2 border-r border-r-gray-300">
                    <Text className="text-5xl font-psemibold pt-2">{amount?.friends}</Text>
                    <Text className="text-[15px] font-pmedium">Buddies</Text>
                  </View>
                  <View className="items-center w-1/2">
                    <Text className="text-5xl font-psemibold pt-2">{amount?.posts}</Text>
                    <Text className="text-[15px] font-pmedium">Posts</Text>
                  </View>
                </View>

                {/* tabs */}
                <View className="flex-1 flex-row justify-between items-center w-full px-2 py-6 bg-lightGrayColor">

                  <TouchableOpacity onPress={() => setTab(1)} className={`w-1/2 items-center border border-purpleColor py-2 ${tab == 1 ? "bg-purpleColor" : "bg-lightGrayColor2"} rounded-l-md`}>
                    <Feather name="grid" size={24} color={`${tab == 1 ? "#F3F6F6" : "#000000"}`} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setTab(2)} className={`w-1/2 items-center border border-purpleColor py-2 ${tab == 2 ? "bg-purpleColor" : "bg-lightGrayColor2"} rounded-r-md`}>
                    <Entypo name="folder-video" size={24} color={`${tab == 2 ? "#F3F6F6" : "#000000"}`} />
                  </TouchableOpacity>

                </View>

                {tab == 1 && <ShowUserPosts userId={isProfilePath ? profile?._id : userId} />}
                {tab == 2 && <ShowUserThreels userId={isProfilePath ? profile?._id : userId} />}
              </View>}
          </>
        )}
      />
    </View>
  )
}

export default UserProfile