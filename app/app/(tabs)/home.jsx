import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import TabScreenLayout from '../../components/tabScreenLayout'
import { dataFetcher } from './../../scripts/apiCaller';
import { postUrl } from '../../scripts/endpoints';
import PostCards from '../../components/postCards';
import { useFocusEffect } from 'expo-router';

const Home = () => {

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [postAmount, setPostAmount] = useState(0)
  const [refresh, setRefresh] = useState(false)
  const [firstPrint, setFirstPrint] = useState(true)

  const fetchPost = async (pageNum) => {
    setLoading(true)
    let result = await dataFetcher(`${postUrl}/posts/normal/${pageNum}/10`)
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

  // auto load the page when coming back from other screen
  useFocusEffect(useCallback(() => {
    if (firstPrint == false) onRefresh()
  }, []))

  // remove the deleted post from the list
  const deletePost = (postId) => {
    setPosts(prev => prev.filter(e => e._id != postId))
  }

  return (
    <TabScreenLayout>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <PostCards post={item} deleted={deletePost} />
        )}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        extraData={posts}
        onEndReachedThreshold={1}
        onEndReached={refectchPost}
        ListFooterComponent={() => (
          <View className="flex-1 py-3">
            {loading && <ActivityIndicator size={'large'} color={"#6835F0"} />}
            {!loading && <Text className="font-psemibold text-xl text-center">No more posts</Text>}
          </View>
        )}

        refreshing={refresh}
        onRefresh={onRefresh}
        contentContainerStyle={{ paddingBottom: 10 }}
      />

    </TabScreenLayout>
  )
}

export default Home