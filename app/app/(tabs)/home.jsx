import { View, Text, ActivityIndicator, ScrollView, RefreshControl } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import TabScreenLayout from '../../components/tabScreenLayout'
import { dataFetcher } from './../../scripts/apiCaller';
import { postUrl } from '../../scripts/endpoints';
import PostCards from '../../components/postCards';
import { useFocusEffect } from 'expo-router';
import authStore from '../../constants/authStore';
import { connectSocket } from '../../constants/socketConnection'
import SearchBox from '../../components/searchBox';

const Home = () => {

  const { token, increaseNotificationCount, socketConnected, setSocketConnection, setNewNotification } = authStore()

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [postAmount, setPostAmount] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [firstPrint, setFirstPrint] = useState(true)
  const limit = 10

  // connect to socket
  useEffect(() => {
    connectSocket(
      token,
      increaseNotificationCount,
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
        <SearchBox />

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