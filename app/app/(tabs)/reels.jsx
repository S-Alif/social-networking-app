import { View, Text, ActivityIndicator, FlatList, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReelsVideoCard from '../../components/reelsVideoCard'
import { dataFetcher } from '../../scripts/apiCaller'
import { postUrl } from '../../scripts/endpoints'
import { useFocusEffect } from '@react-navigation/native'

const { height: windowHeight } = Dimensions.get('window')

const ReelsScreen = () => {

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [postAmount, setPostAmount] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [currentPlaying, setCurrentPlaying] = useState(null)
  const [isFocused, setIsFocused] = useState(true)

  const fetchPost = async (pageNum) => {
    setLoading(true)
    let result = await dataFetcher(`${postUrl}/posts/reels/${pageNum}/10`)
    if (result != null) {
      setPosts(prevPosts => [...prevPosts, ...result.data?.posts])
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
    if ((page * 10) > postAmount) return
    setPage(prev => prev + 1)
  }

  // on refresh
  const onRefresh = () => {
    setPage(1)
    setPostAmount(0)
    setPosts([])
    setRefresh(true)
  }

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentPlaying(viewableItems[0].item._id)
    }
  }).current

  useFocusEffect(
    useCallback(() => {
      setIsFocused(true)
      return () => {
        setIsFocused(false)
        setCurrentPlaying(null)
      };
    }, [])
  )


  return (
    <View className="flex-1">

      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ReelsVideoCard reels={item} isPlaying={isFocused && currentPlaying === item._id} />
        )}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        extraData={posts}
        onEndReachedThreshold={1}
        onEndReached={refectchPost}
        ListFooterComponent={() => (
          <View className="flex-1 py-3">
            {loading && <ActivityIndicator size={'large'} color={"#6835F0"} />}
            {!loading && <Text className="font-psemibold text-xl text-center">No more threels</Text>}
          </View>
        )}

        refreshing={refresh}
        onRefresh={onRefresh}

        snapToAlignment="start"
        snapToInterval={windowHeight}
        decelerationRate="fast"
        pagingEnabled
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
        onViewableItemsChanged={onViewableItemsChanged}
      />

    </View>
  )
}

export default ReelsScreen