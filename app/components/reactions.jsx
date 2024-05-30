import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native'

const reactions = ['👍', '😂', '❤️', '😲', '😢', '😡']

const Reactions = ({ onSelectReaction }) => {
  return (
    <View className="absolute bottom-[50px] left-0 bg-white flex-1 flex-row py-3 rounded-lg" style={{ elevation: 5, shadowRadius: 3, shadowColor: '#000', }}>
      {reactions.map((reaction) => (
        <TouchableOpacity
          className="mx-2"
          key={reaction}
          onPress={() => onSelectReaction(reaction)}
        >
          <Text className="text-4xl">{reaction}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default Reactions