import { View, Text, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams, usePathname } from 'expo-router'
import { Feather, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { dataFetcher } from './../scripts/apiCaller';
import PostCards from './postCards';
import { postUrl, userUrl } from '../scripts/endpoints';
import { formatDate } from '../scripts/dateFormatter';
import authStore from '../constants/authStore';

const UserProfile = () => {

  const { userId } = useLocalSearchParams()
  const pathname = usePathname()

  const { profile } = authStore()

  const [userData, setUserData] = useState(null)
  const [amount, setAmount] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState(1)
  const [normalPosts, setNormalPosts] = useState([])
  const [normalPostsCount, setNormalPostsCount] = useState(null)
  const [postPage, setPostPage] = useState(1)
  const [reelsPosts, setReelsPosts] = useState([])
  const [reelsPostsCount, setReelsPostsCount] = useState(null)
  const [reelsPage, setReelsPage] = useState(1)


  // fetch data
  useEffect(() => {
    (async () => {
      if (pathname != '/pages/profile') {
        var user = await dataFetcher(userUrl + '/profile/' + userId)
        if (user != null && user?.status != 0) setUserData(user?.data)
      } else {
        user = profile
        setUserData(user)
      }

      // fetch post and profile amount datas based on privacy
      if (pathname == "/pages/profile" || (user?.data?.privacy == "public" || user?.data.isFriends == true)) {
        let userAmounts = await dataFetcher(`${postUrl}/amounts/user/${pathname !== "/pages/profile" ? user?.data?._id : profile?._id}`)
        if (userAmounts != null && userAmounts?.status != 0) {
          setAmount(userAmounts?.data)
        }
      }
    })()
  }, [])

  // fetch posts based on privacy
  useEffect(() => {
    if (userData != null && (userData?.privacy == 'public' || userData?.isFriends == true)) {

      (async () => {
        setLoading(true)
        if (tab == 1) {
          let posts = await dataFetcher(`${postUrl}/posts/user/normal/${postPage}/10/${userData?._id}`)
          if (posts != null && posts?.status != 0) {
            setNormalPosts(posts?.data?.posts)
            setNormalPostsCount(posts?.data?.totalCount)
          }
        }

        setLoading(false)
      })()
    }
  }, [userData])



  return (
    <View className="flex-1 bg-lightGrayColor">

      {/* rename the header title */}
      {
        pathname == "/pages/profile" ?
          <Stack.Screen options={{ headerTitle: "Profile" }} />
          : <Stack.Screen options={{ headerTitle: (userData?.firstName && userData?.lastName) ? `${userData?.firstName} ${userData?.lastName}` : "User Profile" }} />
      }


      {/* main profile */}
      <FlatList
        data={tab === 1 ? normalPosts : reelsPosts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View className="mx-2">
            <PostCards post={item} />
          </View>
        )}
        extraData={tab === 1 ? normalPosts : reelsPosts}

        ListHeaderComponent={() => (
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
            <View className="flex-1 w-full px-4 pt-[60] pb-5">
              <Text className="text-3xl font-pbold pt-2 mt-6 text-center">{userData?.firstName} {userData?.lastName}</Text>

              {
                (userData?.city || userData?.country) &&
                <Text className="text-xl font-pmedium text-grayColor text-center pt-2">
                  {userData?.city ? userData?.city : ""}{userData?.city && userData?.country ? "," : ""} {userData?.country ? userData?.country : ""}
                </Text>
              }

              <Text className="text-center pt-2 text-[16] font-pmedium text-gray-400"> Joined on {formatDate(userData?.createdAt)}</Text>
            </View>

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
          </View>
        )}

        ListEmptyComponent={() => (
          <Text className="text-2xl text-center py-5 font-pmedium">No posts found</Text>
        )}

        ListFooterComponent={() => (
          <View className="flex-1 py-3">
            {loading && <ActivityIndicator size={'large'} color={"#6835F0"} />}
            {!loading && <Text className="font-psemibold text-xl text-center py-2"><MaterialCommunityIcons name="dots-horizontal" size={24} color="black" /></Text>}
          </View>
        )}
      />
    </View>
  )
}

export default UserProfile