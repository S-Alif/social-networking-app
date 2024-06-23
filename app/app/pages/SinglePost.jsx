import { View, Text, TextInput, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { dataFetcher } from '../../scripts/apiCaller'
import { commentUrl, postUrl } from '../../scripts/endpoints'
import PostCards from '../../components/postCards'
import CustomButton from './../../components/CustomButton';
import CommentCard from '../../components/commentCard'
import { Entypo } from '@expo/vector-icons';

const SinglePost = () => {

  const params = useLocalSearchParams()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [page, setPage] = useState(1)
  const [newComment, setNewComment] = useState("")

  // fetch comments function
  const fetchComments = async () => {
    let result = await dataFetcher(`${commentUrl}/${params?.postId}/${page}/20`)
    if (result == null || result?.status == 0) return
    setComments(result?.data)
  }

  // fetch the post
  useEffect(() => {
    (async () => {
      setLoading(true)
      let post = await dataFetcher(postUrl + '/posts/' + params?.postId)
      if (post == null || post?.status == 0) return
      setData(post?.data)
      setLoading(false)
    })()
  }, [])

  // fetch the comments
  useEffect(() => {
    (async () => {
      await fetchComments()
    })()
  }, [page])

  return (
    <View className="flex-1 bg-lightGrayColor">

      {data != null && <Stack.Screen options={{ headerTitle: data?.authorDetails?.firstName + data?.authorDetails?.lastName, headerTitleStyle: { fontSize: 20, fontFamily: "Poppins-Medium" } }} />}

      <FlatList
        data={comments}
        keyExtractor={(item) => item?._id}
        extraData={comments}
        renderItem={({ item }) => (
          <CommentCard postId={params?.postId} postAuthor={data?.author} comment={item} />
        )}
        ListHeaderComponent={() => (
          <View className="px-2">
            {
              data != null &&
              <>
                <PostCards post={data} />

                {/* comment fields */}
                <TextInput
                  onChange={setNewComment}
                  value={newComment}
                  placeholder={`Comment as ${data?.authorDetails?.firstName + data?.authorDetails?.lastName}`}
                  className="w-full h-[60] border-2 border-grayColor rounded-lg p-2 font-pmedium text-[18px] mt-10 focus:border-purpleColor"
                  multiline={true}
                />
                <CustomButton
                  title={"Submit comment"}
                  containerStyles={"bg-purpleColor my-4 h-[50] rounded-lg"}
                  textStyles={"text-white font-psemibold text-xl"}
                />
              </>
            }
          </View>
        )}

        ListEmptyComponent={() => (
          <Text className="font-pmedium text-xl text-center">No comments</Text>
        )}

        ListFooterComponent={() => (
          <Text className="pt-4 text-center"><Entypo name="dots-three-horizontal" size={24} color="grey" /></Text>
        )}

        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  )
}

export default SinglePost