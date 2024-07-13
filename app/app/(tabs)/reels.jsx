import { ActivityIndicator, Dimensions, ScrollView, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ReelsVideoCard from '../../components/reelsVideoCard'
import { dataFetcher } from '../../scripts/apiCaller'
import { postUrl } from '../../scripts/endpoints'
import { useFocusEffect } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useNavigation } from 'expo-router'

const { height: windowHeight } = Dimensions.get('window')

const ReelsScreen = () => {

  const { reelsId } = useLocalSearchParams()
  const navigation = useNavigation()

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [postAmount, setPostAmount] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [currentPlaying, setCurrentPlaying] = useState(null)
  const [isFocused, setIsFocused] = useState(true)

  const fetchPost = async (pageNum) => {
    setLoading(true)
    if (reelsId) {
      var reel = await dataFetcher(postUrl + '/posts/' + reelsId)
    }
    let result = await dataFetcher(`${postUrl}/posts/reels/${pageNum}/10`)
    if (result != null) {
      let newPosts = result?.data?.posts
      if (reelsId && reel != null && reel?.status == 1) {
        newPosts = newPosts.filter(post => post._id !== reel?.data._id)
        setPosts(prev => [...[reel?.data], ...prev, ...newPosts])
      }
      else {
        setPosts(prev => [...prev, ...newPosts])
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
        fetchPost(page)
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
    if ((page * 10) >= postAmount) return
    setPage(prev => prev + 1)
  }

  // on refresh
  const onRefresh = () => {
    setPage(1)
    setPostAmount(0)
    setPosts([])
    setRefresh(true)
  }

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 50) {
      refectchPost()
    }
    const visibleItemIndex = Math.ceil(contentOffset.y / windowHeight)
    if (posts[visibleItemIndex] && posts[visibleItemIndex]._id !== currentPlaying) {
      setCurrentPlaying(posts[visibleItemIndex]._id)
    }
  }

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true)
      return () => {
        setIsFocused(false)
        setCurrentPlaying(null)
      }
    }, [])
  )


  return (
    <SafeAreaView className="flex-1 bg-black relative">

      <ScrollView
        snapToAlignment='start'
        snapToInterval={windowHeight}
        decelerationRate="fast"
        pagingEnabled
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
      >
        <View className="flex-1">
          {
            posts.length > 0 &&
            posts.map((e, index) => (
              <ReelsVideoCard reels={e} isPlaying={isFocused && currentPlaying === e._id} key={index} />
            ))
          }
        </View>

        {loading && <ActivityIndicator size={"small"} color={"#fff"} />}
        {(!loading && ((page * 10) >= postAmount)) && <Text className="text-white text-center py-3 text-xl">No more threels</Text>}

      </ScrollView>

    </SafeAreaView>
  )
}

export default ReelsScreen