import { View, Text, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import { formatDate } from '../scripts/dateFormatter'
import authStore from '../constants/authStore'
import { Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { dataSender } from '../scripts/apiCaller';
import { commentUrl } from '../scripts/endpoints';
import { router } from 'expo-router';

const CommentCard = ({ postId, postAuthor, comment: { _id, authorFirstName, authorId, authorLastName, authorProfileImg, comment, createdAt, edited }, deleted }) => {

  const { profile } = authStore()
  const [modal, setModal] = useState(false);

  // delete comment
  const deleteComment = async () => {
    let result = await dataSender(`${commentUrl}/delete/${postId}/${_id}`)
    if (result?.status == 0 || result == null) return
    setModal(false)
    deleted(_id)
  }

  return (
    <View className="bg-lightGrayColor2 mx-2 mt-2 p-3 rounded-lg border border-gray-300 flex-grow" style={{ minHeight: 84 }}>

      {/* author details, post date and options */}
      <View className="h-[60px] w-full flex-1 flex-row items-center">
        <View className="flex-1 flex-row gap-3 items-center">
          <TouchableOpacity>
            <Image source={{ uri: authorProfileImg }} className="w-[50px] h-[50px] rounded-full" />
          </TouchableOpacity>

          <View className="flex-1 flex-row">
            <View className="">
              <Text className="text-xl font-pbold">{authorFirstName} {authorLastName}</Text>
              <Text className="text-[12px] font-pbold text-gray-300">{formatDate(createdAt)}</Text>
            </View>

            <View className="flex-row ml-4 h-1/2">
              {(postAuthor == authorId) && <Text className="px-2 py-1 bg-purpleColor text-white text-sm font-psemibold rounded-lg">Author</Text>}
              {edited && <Text className="ml-2 px-2 py-1 bg-lightGrayColor text-sm font-psemibold rounded-lg">Edited</Text>}
            </View>
          </View>
        </View>

        {/* button */}
        {
          profile?._id == authorId &&
          <View>
            <TouchableOpacity onPress={() => setModal(prev => !prev)}>
              <Entypo name="dots-three-vertical" size={18} color="black" />
            </TouchableOpacity>
          </View>
        }
      </View>

      <Modal
        animationType='fade'
        visible={modal}
        onRequestClose={() => setModal(false)}
        transparent={true}
      >
        <TouchableWithoutFeedback onPress={() => setModal(false)}>
          <View className="flex-1 justify-center items-center bg-[#1a1b1c1e] px-4">
            <View className="bg-lightGrayColor2 w-full rounded-lg border border-gray-400" style={{ shadowColor: "#000", elevation: 5, shadowOpacity: 0.3 }}>

              {/* update comment */}
              <TouchableOpacity
                className="flex-row justify-center items-center py-3 border-b border-b-gray-400"
                onPress={() => {
                  setModal(false)
                  router.push({ pathname: 'pages/updateComment', params: { _id: _id, commentOn: postId, comment: comment } })
                }}
              >
                <FontAwesome name="cog" size={26} color="black" />
                <Text className="text-xl font-pmedium pl-2">Update comment</Text>
              </TouchableOpacity>

              {/* delete comment */}
              <TouchableOpacity className="flex-row justify-center items-center py-3" onPress={deleteComment}>
                <MaterialIcons name="delete-forever" size={26} color="black" />
                <Text className="text-xl font-pmedium pl-2">Delete comment</Text>
              </TouchableOpacity>

            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>



      <Text className="font-pmedium pt-3 text-lg">{comment}</Text>
    </View>
  )
}

export default CommentCard