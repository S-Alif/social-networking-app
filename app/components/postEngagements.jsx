import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import ReactionButton from './reactionButton'
import { EvilIcons, AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';
import { generateShareLink, shareItem } from '../scripts/deepLink';


const PostEngagements = ({ postId, reaction }) => {
  return (
    <View className="flex-1 flex-row h-[55px] justify-around items-center bg-lightGrayColor2 border-y border-gray-300 p-3 rounded-bl-lg rounded-br-lg">

      {/* reactions */}
      <View className="flex-1 border-r">
        <ReactionButton postId={postId?._id} reaction={reaction} />
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
  )
}

export default PostEngagements