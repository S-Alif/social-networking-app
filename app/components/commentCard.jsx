import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { formatDate } from '../scripts/dateFormatter'

const CommentCard = ({ postId, comment: { _id, authorFirstName, authorId, authorLastName, authorProfileImg, comment, createdAt, edited }}) => {

  return (
    <View className="bg-lightGrayColor2 mx-2 mt-2 p-3 rounded-lg border border-gray-300">

      {/* author details, post date and options */}
      <View className="h-[60px] w-full flex-1 flex-row">
        <View className="flex-1 h-full flex-row gap-3 items-center">
          <TouchableOpacity>
            <Image source={{ uri: authorProfileImg }} className="w-[50px] h-[50px] rounded-full" />
          </TouchableOpacity>

          <View>
            <Text className="text-xl font-pbold">{authorFirstName} {authorLastName}</Text>
            <Text className="text-[12px] font-pbold text-gray-300">{formatDate(createdAt)}</Text>
          </View>
        </View>
      </View>

      <Text className="font-pmedium pt-2 text-lg">{comment}</Text>
    </View>
  )
}

export default CommentCard