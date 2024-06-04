import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import TabScreenLayout from '../../components/tabScreenLayout'
import { dataFetcher } from './../../scripts/apiCaller';
import { postUrl } from '../../scripts/endpoints';
import PostCards from '../../components/postCards';

const Home = () => {

  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [postAmount, setPostAmount] = useState(0)

  // get the posts
  useEffect(() => {
    (async () => {
      setLoading(true)
      let result = await dataFetcher(`${postUrl}/posts/${page}/10`)
      if(result != null){
        setPosts(prevPosts => [...prevPosts, ...result.data?.posts])
        setPostAmount(result?.data?.totalCount)
      }
      setLoading(false)
    })()
  }, [page])

  // on reach screen end
  const refectchPost = () => {
    if((page * 10) > postAmount) return
    setPage(prev => prev + 1)
  }


  return (
    <TabScreenLayout>
      <FlatList 
        data={posts}
        keyExtractor={(item) => item._id}
        renderItem={({item}) => (
          <PostCards post={item} />
        )}
        extraData={posts}
        onEndReachedThreshold={1}
        onEndReached={refectchPost}
        ListFooterComponent={() => (
          <View className="flex-1 py-3">
            {loading && <ActivityIndicator size={'large'} color={"#6835F0"} />}
            {!loading && <Text className="font-psemibold text-xl text-center">No more posts</Text>}
          </View>
        )}
      />

    </TabScreenLayout>
  )
}

export default Home