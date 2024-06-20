import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import ReactionButton from './reactionButton'
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { generateShareLink, shareItem } from '../scripts/deepLink';

const ReelsEngagement = ({ reelsId, reaction }) => {
  return (
    <View className="bg-transparent w-[50] h-[200] absolute bottom-[150] right-4 items-center flex-1 flex-col gap-y-3">
      {/* reactions */}
      <View className="flex-1 relative">
        <ReactionButton postId={reelsId?._id} reaction={reaction} />
      </View>

      <View className="flex-1 pt-2">
        <TouchableOpacity
          style={{ elevation: 5, shadowRadius: 3, shadowColor: '#000', }}
          onPress={() => router.push({ pathname: "pages/showComments", params: { postId: reelsId?._id, author: reelsId?.author } })}
        >
          <MaterialCommunityIcons name="message-settings" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-1">
        <TouchableOpacity
          onPress={async () => {
            let result = generateShareLink("threel", reelsId?._id)
            await shareItem("Share threel", "See this threel", result)
          }}
        >
          <FontAwesome5 name="share-alt" size={26} color="white" />
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default ReelsEngagement