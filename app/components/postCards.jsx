import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native'
import React, { useState } from 'react'
import authStore from '../constants/authStore'
import { formatDate } from '../scripts/dateFormatter'
import { ResizeMode, Video } from 'expo-av'
import { AntDesign } from '@expo/vector-icons';

// attachments
const AttachmentHandler = ({attachment}) => {

  const [play, setPlay] = useState(false)

  if (attachment.fileType == "image"){
    return (
      <View className="aspect-video min-w-full rounded-md overflow-hidden">
        <Image source={{ uri: attachment.fileLocation }} className="w-full h-full" />
      </View>
    )
  }
  else{
    return(
      <View className="aspect-video min-w-full rounded-md overflow-hidden">
        {play ? (
          <Video source={{ uri: attachment.fileLocation }}
            className="w-full h-full rouned-xl mt-3"
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={(status) => {
              if (status.didJustFinish) {
                setPlay(false)
              }
            }}
          />
        ) : (
          <TouchableOpacity className="w-full h-60 rounded-xl mt-3 relative justify-center items-center" activeOpacity={0.7} onPress={() => setPlay(true)}>
              <AntDesign name="play" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
    )
  }

}


// cards
const PostCards = ({ post: { _id, author, caption, createdAt, authorDetails: { firstName, lastName, profileImg }, attachments }}) => {

  const {pofile} = authStore()

  return (
    <View className="border border-gray-300 rounded-lg my-2 bg-lightGrayColor2 p-3">

      {/* author details, post date and options */}
      <View className="h-[60px] w-full flex-1 flex-row">
        <View className="flex-1 h-full flex-row gap-3 items-center">
          <TouchableOpacity>
            <Image source={{ uri: profileImg }} className="w-[50px] h-[50px] rounded-full" />
          </TouchableOpacity>
          
          <View>
            <Text className="text-xl font-pbold">{firstName} {lastName}</Text>
            <Text className="text-[12px] font-pbold text-gray-300">{formatDate(createdAt)}</Text>
          </View>
        </View>
      </View>

      <Text className="text-2xl">{caption}</Text>

      {/* attachments */}
      {
        attachments.length > 0 &&
        <View className="mt-3 w-full h-[250px] flex-1">
          <FlatList
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            data={attachments}
            keyExtractor={(item) => item._id}
            renderItem={({item}) => (
              <AttachmentHandler attachment={item} />
            )}
          />
        </View>
      }
    </View>
  )
}

export default PostCards