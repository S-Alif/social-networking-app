import { View, Text, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { dataFetcher, reactionSender } from '../../scripts/apiCaller'
import { commentUrl, postUrl } from '../../scripts/endpoints'
import PostCards from '../../components/postCards'
import CustomButton from './../../components/CustomButton';
import CommentCard from '../../components/commentCard'
import authStore from '../../constants/authStore'
import { customAlert } from '../../scripts/alerts'

const SinglePost = () => {

  const params = useLocalSearchParams()
  const {profile} = authStore()

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [page, setPage] = useState(1)
  const [newComment, setNewComment] = useState({
    commentOn: params?.postId,
    comment: ""
  })
  const [refresh, setRefresh] = useState(false)
  const [firstLoad, setFirstLoad] = useState(true)

  // fetch comments function
  const fetchComments = async (pageNum) => {
    let result = await dataFetcher(`${commentUrl}/${params?.postId}/${pageNum}/10`)
    if (result == null || result?.status == 0) return
    if (refresh) {
      setRefresh(false)
      return setComments(result?.data)
    }
    setComments(prev => [...prev, ...result?.data])
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
      await fetchComments(page)
      if (firstLoad) {
        setFirstLoad(false)
      }
    })()
  }, [page])

  useEffect(() => {
    if (refresh) {
      (async () => {
        if (page == 1) return await fetchComments(1)
        setPage(1)
      })()
    }
  }, [refresh])

  useFocusEffect(useCallback(() => {
    setRefresh(true)
  }, []))


  // post a comment
  const handlePostComment = async () => {

    if (newComment.comment.trim() == '') return
    setLoading(true)
    let comment = await reactionSender(commentUrl, newComment)
    setLoading(false)
    if (comment?.status == 0 || comment == null) return customAlert('ERROR !!', "Could not post your comment")
    setNewComment({
      commentOn: params?.postId,
      comment: ""
    })
    setRefresh(true)
  }

  // handle deleted comment
  const handleDeletedComment = (e) => {
    setComments(prev => prev.filter(comment => comment._id !== e))
  }


  return (
    <View className="flex-1 bg-lightGrayColor">

      {data != null && <Stack.Screen options={{ headerTitle: data?.authorDetails?.firstName + " " + data?.authorDetails?.lastName, headerTitleStyle: { fontSize: 22, fontFamily: "Poppins-SemiBold" } }} />}

      <ScrollView
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* the post */}
        <View className="flex-1 px-2">
          {
            data != null &&
            <>
              <PostCards post={data} />

              {/* comment fields */}
              <TextInput
                onChangeText={(e) => setNewComment({ ...newComment, ["comment"]: e })}
                value={newComment?.comment}
                placeholder={`Comment as ${profile?.firstName} ${profile.lastName}`}
                className="w-full h-[60] border-2 border-grayColor rounded-lg p-2 font-pmedium text-[18px] focus:border-purpleColor mt-10"
                multiline={true}
              />
              <CustomButton
                title={"Submit comment"}
                containerStyles={"bg-purpleColor my-4 h-[50] rounded-lg"}
                textStyles={"text-white font-psemibold text-xl"}
                handlePress={handlePostComment}
              />
            </>
          }
        </View>

        {/* render comments */}
        <View className="flex-1 pt-10">
          {
            comments.length > 0 ?
              <Text className="text-xl font-psemibold pb-2 mb-3 border-b-2 border-b-darkGrayColor mx-2">All comments</Text>
              : <></>
          }
          {
            comments.length > 0 &&
            comments.map((e, index) => (
              <CommentCard postId={params?.postId} postAuthor={data?.author} comment={e} key={index} deleted={handleDeletedComment} />
            ))
          }

          {loading && <ActivityIndicator size={"large"} color={"#6835F0"} />}
        </View>
      </ScrollView>
    </View>
  )
}

export default SinglePost