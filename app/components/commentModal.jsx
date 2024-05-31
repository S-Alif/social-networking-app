// CommentModal.js
import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';
import FormTextInput from './textInput';
import CustomButton from './CustomButton';
import { FontAwesome } from '@expo/vector-icons';
import { reactionFetcher, reactionSender } from './../scripts/apiCaller';
import { commentUrl } from '../scripts/endpoints';

const CommentModal = ({ visible, onClose, postId }) => {
  const [newComment, setNewComment] = useState('');
  const [clearField, setClearField] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1)
  const [comments, setComments] = useState([])

  // fetch comments
  useEffect(() => {
    if(visible){
      (async () => {
        let comment = await reactionFetcher(`${commentUrl}/${postId}/${page}/20`)
        if(comment?.status == 0 || comment == null) return
        setComments(prev => [...prev, ...comment?.data])
      })()
    }
  }, [page, visible])

  // remove comments when not visisble
  useEffect(() => {
    if(!visible){
      setComments([])
    }
  }, [visible])

  console.log(comments)

  const handlePostComment = () => {
    if (newComment.trim()) {
      postComment(newComment);
      setNewComment('');
    }
  };

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
            <View className="flex-1 absolute w-full h-[80%]">
              <Text className="text-center text-xl font-pmedium py-3 border-b border-b-gray-300">comments</Text>


            </View>

            {/* show comment forms */}
            <View className="flex-1 px-2 bg-lightGrayColor2 justify-between items-center flex-row absolute w-full h-[15%] bottom-0 border-t border-t-gray-300">
              <View className="w-[85%] pr-3 pb-3">
                <FormTextInput
                  // title={"Write a comment"}
                  containerStyle={"py-0"}
                  placeholder={"Write a comment"}
                  validationMsg={"comment should be at least 2 characters"}
                  value={newComment}
                  onChangeText={setNewComment}
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
