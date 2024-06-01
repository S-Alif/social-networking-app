import { View, Text, KeyboardAvoidingView, ScrollView, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { commentUrl } from '../../scripts/endpoints'
import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import { reactionFetcher, reactionSender } from '../../scripts/apiCaller'
import CommentCard from '../../components/commentCard'
import FormTextInput from '../../components/textInput'
import CustomButton from '../../components/CustomButton'
import { FontAwesome } from '@expo/vector-icons'
import { customAlert } from '../../scripts/alerts'

const ShowComments = () => {

  const params = useLocalSearchParams()

  const [newComment, setNewComment] = useState({
    commentOn: params?.postId,
    comment: ""
  })

  const [clearField, setClearField] = useState(false)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [comments, setComments] = useState([])
  const [refresh, setRefresh] = useState(false)

  // fetch comments
  useEffect(() => {
    (async () => {
      let comment = await reactionFetcher(`${commentUrl}/${params?.postId}/${page}/20`)
      if (comment?.status == 0 || comment == null) return
      setComments(comment?.data)
      setRefresh(false)
    })()
  }, [page, refresh])


  // post the comment
  const handlePostComment = async () => {

    if(newComment.comment == '') return

    setClearField(false)
    setLoading(true)
    let comment = await reactionSender(commentUrl, newComment)
    setLoading(false)
    if (comment?.status == 0 || comment == null) return customAlert('ERROR !!', "Could not post your comment")
    setNewComment({
      commentOn: params?.postId,
      comment: ""
    })
    setRefresh(true)
    setClearField(true)
  }

  // handle deleted comment
  const handleDeletedComment = (e) => {
    setLoading(true)
    setComments(prev => prev.filter(comment => comment._id !== e))
    setLoading(false)
  }

  useFocusEffect(useCallback(() => {
    setRefresh(true)
  }, []))


  return (
    <View className="flex-1 relative bg-lightGrayColor">
      <View className="flex-1 absolute w-full h-[87%]">
        {
          comments.length == 0 &&
          <View className="flex-1 items-center">
            {refresh &&
              <View className="flex-1 justify-center items-center w-full h-[60px]">
                <ActivityIndicator size={"large"} color={"black"} />
              </View>
            }
            <Text className="pt-10 font-psemibold text-2xl text-gray-400">Be the first one to comment</Text>
          </View>
        }

        <ScrollView key={loading} contentContainerStyle={{ paddingBottom: 12 }}>
          {
            comments.map((e, index) => (
              <CommentCard postId={params?.postId} postAuthor={params?.author}  comment={e} key={index} deleted={handleDeletedComment} />
            ))
          }
        </ScrollView>
      </View>

      {/* comment box */}
      <View className="absolute bottom-0 h-[13%]">
        <KeyboardAvoidingView className="flex-1" behavior='padding'>
          <View className="w-full flex-1 flex-row justify-between items-center px-2 py-5 bg-lightGrayColor2 border-t border-t-gray-300">
            <View className="flex-1 mr-2">
              <FormTextInput
                // title={"Write a comment"}
                containerStyle={"pt-0"}
                placeholder={"Write a comment"}
                validationMsg={"comment should be at least 2 characters"}
                value={(e) => setNewComment({ ...newComment, comment: e })}
                regex={/^.{2,}$/}
                clear={clearField}
              />
            </View>
            <View>
              <CustomButton
                title={<FontAwesome name="paper-plane" size={24} color="white" />}
                handlePress={handlePostComment}
                isloading={loading}
                containerStyles={"bg-purpleColor w-[60px] h-[60px] mt-3"}
                textStyles={"text-lightGrayColor2 text-xl font-pmedium"}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  )
}

export default ShowComments