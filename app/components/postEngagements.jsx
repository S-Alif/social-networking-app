import { View, Text, TouchableOpacity, Modal, ScrollView, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import ReactionButton from './reactionButton'
import { EvilIcons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import { generateShareLink, shareItem } from '../scripts/deepLink';
import { dataFetcher } from '../scripts/apiCaller';
import { reactionUrl } from '../scripts/endpoints';
import FriendListCard from './friendListCard';


const PostEngagements = ({ postId, reaction, engages }) => {

  const pathname = usePathname()
  const isSinglePost = pathname == "/pages/SinglePost"

  const [newReactionCount, setNewReactionCount] = useState(0)
  const [modalVisible, setModalVisible] = useState(false)
  const [reactions, setReactions] = useState([])

  // get the reactions
  const fetchReactions = async () => {
    setModalVisible(true)
    let result = await dataFetcher(reactionUrl + "/" + postId?._id)
    if(result == null || result?.status == 0) return
    setReactions(result?.data)
  }

  return (
    <View className="flex-1">

      {/* post engagements */}
      <TouchableOpacity
        className="flex-1 flex-row gap-x-3 items-center h-[20] px-3 mt-2 mb-3"
        onPress={fetchReactions}

      >
        <Text className="font-pbold text-gray-400 text-[16px]"> <AntDesign name="like2" size={20} color="rgba(156, 163, 175, 0.7)" /> {`${engages.reactionCount + newReactionCount}`}</Text>
        <Text className="font-pbold text-gray-400 text-[16px]"> <FontAwesome5 name="comment-dots" size={20} color="rgba(156, 163, 175, 0.7)" /> {engages.commentCount}</Text>
      </TouchableOpacity>

      {/* reaction modal */}
      <ReactionsModal visible={modalVisible} onClose={() => setModalVisible(false)} reactions={reactions}  />

      {/* post engagement buttons */}
      <View className="flex-1 flex-row h-[55px] justify-around items-center bg-lightGrayColor2 border-y border-gray-300 p-3 rounded-bl-lg rounded-br-lg">

        {/* reactions */}
        <View className="flex-1 border-r">
          <ReactionButton postId={postId} reaction={reaction} currentUserAction={(e) => setNewReactionCount(prev => prev + e)} />
        </View>

        {
          !isSinglePost &&
          <View className="flex-1 border-r">
            <TouchableOpacity
              className="flex-1 justify-center items-center flex-row"
              onPress={() => router.push({ pathname: "pages/showComments", params: { postId: postId?._id, author: postId?.author, type: "post" } })}
            >
              <EvilIcons name="comment" size={29} color="black" />
              <Text className="text-lg"> comment</Text>
            </TouchableOpacity>
          </View>
        }

        <View className="flex-1">
          <TouchableOpacity
            className="flex-1 justify-center items-center flex-row"
            onPress={async () => {
              let result = generateShareLink("post", postId?._id)
              await shareItem("Share Post", "See this post", result)
            }}
          >
            <AntDesign name="sharealt" size={20} color="black" />
            <Text className="text-lg"> share</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  )
}

export default PostEngagements


// reaction modal
const ReactionsModal = ({ visible, onClose, reactions }) => {

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 w-full h-screen justify-end">
          <View className="flex-1 w-full max-h-[75%] bg-lightGrayColor px-2">
            <TouchableOpacity onPress={onClose} className="h-2 bg-gray-300 w-[50px] self-center rounded-full mb-4 mt-2" />
            <ScrollView>
              {
                reactions.length > 0 &&
                reactions.map((e, index) => (
                  <FriendListCard data={e} key={index} />
                ))
              }
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}