import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import ReactionButton from './reactionButton'
import { EvilIcons } from '@expo/vector-icons';

const PostEngagements = ({postId, reaction}) => {
  return (
    <View className="flex-1 flex-row h-[55px] justify-around items-center mb-2 bg-lightGrayColor2 border border-gray-300 p-3 rounded-bl-lg rounded-br-lg">
      
      {/* reactions */}
      <View className="flex-1 border-r">
        <ReactionButton postId={postId} reaction={reaction} />
      </View>

      <View className="flex-1">
        <TouchableOpacity className="flex-1 justify-center items-center flex-row">
          <EvilIcons name="comment" size={29} color="black" />
          <Text className="text-lg"> comment</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default PostEngagements