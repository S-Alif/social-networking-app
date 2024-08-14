import { View, Text, FlatList, ActivityIndicator, TextInput, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import TabScreenLayout from '../../components/tabScreenLayout'
import { dataFetcher } from './../../scripts/apiCaller';
import { postUrl } from '../../scripts/endpoints';
import PostCards from '../../components/postCards';
import { router, useFocusEffect } from 'expo-router';
import authStore from '../../constants/authStore';
import { connectSocket } from '../../constants/socketConnection'
import CustomButton from '../../components/CustomButton';
import { FontAwesome } from '@expo/vector-icons';

const Home = () => {

  const { token, notificationCount, setNotificationCount, socketConnected, setSocketConnection, setNewNotification } = authStore()

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [postAmount, setPostAmount] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [firstPrint, setFirstPrint] = useState(true)
  const [searchText, setSearchText] = useState("")
  const limit = 10

  // connect to socket
  useEffect(() => {
    connectSocket(
      token,
      notificationCount,
      setNotificationCount,
      socketConnected,
      setSocketConnection,
      setNewNotification
    )
  }, [])

  // fetch posts
  const fetchPost = async (pageNum) => {
    setLoading(true)
    let result = await dataFetcher(`${postUrl}/posts/normal/${pageNum}/${limit}`)
    if (result != null) {
      if(refresh){
        setPosts([...result.data?.posts])
      }
      else{
        setPosts(prevPosts => [...prevPosts, ...result.data?.posts])
      }
      setPostAmount(result?.data?.totalCount)
    }
    setLoading(false)
    setRefresh(false)
  }

  // get the posts
  useEffect(() => {
    if (refresh == false) {
      (async () => {
        await fetchPost(page)
        if (firstPrint) setFirstPrint(false)
      })()
    }
  }, [page])

  // get the posts on refresh
  useEffect(() => {
    if (refresh == true) {
      (async () => {
        fetchPost(1)
      })()
    }
  }, [refresh])

  // on reach screen end
  const refectchPost = () => {
    if ((page * limit) >= postAmount) return
    setPage(prev => prev + 1)
  }

  // on refresh
  const onRefresh = () => {
    setRefresh(true)
    setPostAmount(0)
    setPage(1)
  }

  // auto load the page when coming back from other screen
  useFocusEffect(useCallback(() => {
    if (firstPrint == false) onRefresh()
  }, []))

  // remove the deleted post from the list
  const deletePost = (postId) => {
    setPosts(prev => prev.filter(e => e._id != postId))
  }

  // handle scroll
  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 50) {
      refectchPost()
    }
  }

  return (
    <TabScreenLayout>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
      >

        {/* search field */}
        <View className="py-3 w-full h-[104px]">
          <View className="bg-lightGrayColor2 p-3 rounded-md flex-1 flex-row justify-between border border-gray-300">
            <TextInput
              placeholder='Search a buddy'
              className="border border-darkGrayColor px-2 py-3 rounded-md font-pmedium text-xl focus:border-purpleColor flex-grow"
              cursorColor={"#6835F0"}
              value={searchText}
              onChangeText={setSearchText}
            />

            <CustomButton
              title={<FontAwesome name="search" size={24} color="white" />}
              handlePress={() => {
                if (searchText?.length < 2) return
                router.push({ pathname: "/pages/buddySearchResult", params: { searchText: searchText } })
                setSearchText("")
              }}
              containerStyles={"bg-purpleColor w-[50px] h-[53px] rounded-md ml-2"}
              textStyles={"text-lightGrayColor2 text-xl font-pmedium pl-1"}
            />
          </View>
        </View>

        {/* show posts */}
        {
          posts.length > 0 &&
          posts.map((e, index) => (
            <PostCards post={e} deleted={deletePost} key={index} />
          ))
        }

        
        <View className="flex-1 py-3">
          {loading && <ActivityIndicator size={'large'} color={"#6835F0"} />}
          {!loading && <Text className="font-psemibold text-xl text-center">No more posts</Text>}
        </View>
      </ScrollView>
    </TabScreenLayout>
  )
}

export default Home