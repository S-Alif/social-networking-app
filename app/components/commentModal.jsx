// CommentModal.js
import React, { useEffect, useState } from 'react';
import { View, Text, Modal, ActivityIndicator, ScrollView } from 'react-native';
import FormTextInput from './textInput';
import CustomButton from './CustomButton';
import { FontAwesome } from '@expo/vector-icons';
import { reactionFetcher, reactionSender } from './../scripts/apiCaller';
import { commentUrl } from '../scripts/endpoints';
import CommentCard from './commentCard';
import { customAlert } from '../scripts/alerts';
import authStore from './../constants/authStore';

const CommentModal = ({ visible, onClose, postId }) => {

  const {profile} = authStore()

  const [newComment, setNewComment] = useState({
    commentOn: postId,
    comment: ""
  })
  const [clearField, setClearField] = useState(false)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [comments, setComments] = useState([])
  const [refresh, setRefresh] = useState(true)

  // fetch comments
  useEffect(() => {
    if (visible) {
      (async () => {
        let comment = await reactionFetcher(`${commentUrl}/${postId}/${page}/20`)
        if (comment?.status == 0 || comment == null) return
        setComments(prev => [...prev, ...comment?.data])
        setRefresh(false)
      })()
    }
  }, [page, visible])

  // remove comments when not visisble
  useEffect(() => {
    if (!visible) {
      setComments([])
    }
  }, [visible])

  // post the comment
  const handlePostComment = async () => {
    setClearField(false)
    setLoading(true)
    let comment = await reactionSender(commentUrl, newComment)
    if (comment?.status == 0 || comment == null) return customAlert('ERROR !!', "Could not post your comment")

    let commentData = {
      _id: comment?.data?._id,
      comment: newComment.comment,
      edited: comment?.data?.edited || false,
      createdAt: comment?.data?.createdAt,
      authorId: profile?._id,
      authorProfileImg: profile?.profileImg,
      authorFirstName: profile?.firstName,
      authorLastName: profile?.lastName,
    }

    setComments(prev => [...[commentData], ...prev])
    setNewComment({
      commentOn: postId,
      comment: ""
    })
    setLoading(false)
    setClearField(true)
  }

  // handle deleted comment
  const handleDeletedComment = (e) => {
    setLoading(true)
    setComments(prev => prev.filter(comment => comment._id !== e))
    setLoading(false)
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-[#1a1b1c1c] relative">
        <View className="flex-1 bg-lightGrayColor absolute bottom-0 w-full h-[90%] border border-gray-500 rounded-tl-xl rounded-tr-xl overflow-hidden">
          <View className="flex-1 relative">

            {/* show comments */}
            <View className="flex-1 absolute w-full h-[85%]">
              <Text className="text-center text-xl font-pmedium py-3 border-b border-b-gray-300">comments</Text>

              {/* comment list */}
              <View className="flex-1">

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

                <ScrollView key={loading}>
                  {
                    comments.map((e, index) => (
                      <CommentCard postId={postId} comment={e} key={index} deleted={handleDeletedComment}  />
                    ))
                  }
                </ScrollView>
              </View>
            </View>

            {/* show comment forms */}
            <View className="flex-1 px-2 bg-lightGrayColor2 justify-between items-center flex-row absolute w-full h-[15%] bottom-0 border-t border-t-gray-300">
              <View className="w-[85%] pr-3 pb-3">
                <FormTextInput
                  // title={"Write a comment"}
                  containerStyle={"py-0"}
                  placeholder={"Write a comment"}
                  validationMsg={"comment should be at least 2 characters"}
                  value={(e) => setNewComment({ ...newComment, comment: e })}
                  regex={/^.{2,}$/}
                  clear={clearField}
                />
              </View>

              <View className="w-[15%] pb-8">
                <CustomButton
                  title={<FontAwesome name="paper-plane" size={24} color="white" />}
                  handlePress={handlePostComment}
                  isloading={loading}
                  containerStyles={"bg-purpleColor h-[50px] mt-14"}
                  textStyles={"text-lightGrayColor2 text-xl font-pmedium"}
                />
              </View>
            </View>

          </View>
        </View>
      </View>

    </Modal>
  );
};

export default CommentModal;
