import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import ReactionButton from './reactionButton'
import { EvilIcons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { generateShareLink, shareItem } from '../scripts/deepLink';


const PostEngagements = ({ postId, reaction, engages }) => {

  const [newReactionCount, setNewReactionCount] = useState(0)

  return (
    <View className="flex-1">
      <View className="flex-1 flex-row gap-x-3 items-center h-[20] px-3 mt-2 mb-3">
        <Text className="font-pbold text-gray-400 text-[16px]"> <AntDesign name="like2" size={20} color="rgba(156, 163, 175, 0.7)" /> {`${engages.reactionCount + newReactionCount}`}</Text>
        <Text className="font-pbold text-gray-400 text-[16px]"> <FontAwesome5 name="comment-dots" size={20} color="rgba(156, 163, 175, 0.7)" /> {engages.commentCount}</Text>
      </View>
      <View className="flex-1 flex-row h-[55px] justify-around items-center bg-lightGrayColor2 border-y border-gray-300 p-3 rounded-bl-lg rounded-br-lg">

        {/* reactions */}
        <View className="flex-1 border-r">
          <ReactionButton postId={postId?._id} reaction={reaction} currentUserAction={(e) => setNewReactionCount(prev => prev + e)} />
        </View>

        <View className="flex-1 border-r">
          <TouchableOpacity
            className="flex-1 justify-center items-center flex-row"
            onPress={() => router.push({ pathname: "pages/showComments", params: { postId: postId?._id, author: postId?.author } })}
          >
            <EvilIcons name="comment" size={29} color="black" />
            <Text className="text-lg"> comment</Text>
          </TouchableOpacity>
        </View>

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