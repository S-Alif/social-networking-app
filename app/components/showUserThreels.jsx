import { View, Text, FlatList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { postUrl } from '../scripts/endpoints'
import { Entypo } from '@expo/vector-icons'
import { dataFetcher } from '../scripts/apiCaller'
import ReelsCard from './reelsCard'

const ShowUserThreels = ({ userId }) => {

  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [postAmount, setPostAmount] = useState(0)

  // fetch posts
  useEffect(() => {
    (async () => {
      setLoading(true)
      let posts = await dataFetcher(`${postUrl}/posts/user/reels/${page}/10/${userId}`)
      if (posts != null && posts?.status != 0) {
        setData(posts?.data?.posts)
        setPostAmount(posts?.data?.totalCount)
      }
      setLoading(false)
    })()
  }, [page])

  // on reach screen end
  const refectchPost = () => {
    if ((page * 10) > postAmount) return
    setPage(prev => prev + 1)
  }

  // remove the deleted post from the list
  const deletePost = (postId) => {
    setData(prev => prev.filter(e => e._id != postId))
  }

  const handleScroll = ({ nativeEvent }) => {
    let offsetY = nativeEvent.contentOffset.y
    let contentHeight = nativeEvent.contentSize.height
    let layoutHeight = nativeEvent.layoutMeasurement.height

    if (offsetY + layoutHeight >= contentHeight - 20) {
      refectchPost()
    }
  }

  return (
    <View className="flex-1 bg-lightGrayColor">
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <View className={`w-full h-[300] pl-2 ${index % 2 != 0 && "pr-2"} mb-2`}>
            <ReelsCard reels={item} deleted={deletePost} />
          </View>
        )}
        numColumns={2}
        columnWrapperStyle={{
          width: "50%",
          justifyContent: "space-between",
        }}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        extraData={data}
        onScroll={handleScroll}
        ListFooterComponent={() => (
          <View className="flex-1 py-3">
            {loading && <ActivityIndicator size={'large'} color={"#6835F0"} />}
            {!loading && <Text className="text-center"><Entypo name="dots-three-horizontal" size={24} color="black" /></Text>}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  )
}

export default ShowUserThreels