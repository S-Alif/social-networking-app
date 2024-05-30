import { View, Text, TouchableOpacity, Image, FlatList, Dimensions, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import authStore from '../constants/authStore'
import { formatDate } from '../scripts/dateFormatter'
import { ResizeMode, Video } from 'expo-av'
import { AntDesign } from '@expo/vector-icons';
import { generateThumbnail } from '../scripts/getThumbnail'

const screenWidth = Dimensions.get('window').width;

// attachments
const AttachmentHandler = ({attachment}) => {

  const [play, setPlay] = useState(false)

  if (attachment.fileType == "image"){
    return (
      <View className="min-h-full rounded-md overflow-hidden" style={{width: screenWidth - 40}} >
        <Image source={{ uri: attachment.fileLocation }} className="w-full h-full" />
      </View>
    )
  }
  else{

    const [thumbnail, setThumbnail] = useState("https://fakeimg.pl/600x400?text=+")
    useEffect(() => {
      (async () => {
        let result = await generateThumbnail(attachment.fileLocation)
        setThumbnail(result)
      })()
    }, [])

    return(
      <View className="min-h-full rounded-md overflow-hidden" style={{ width: screenWidth - 40 }}>
        {play ? (
          <Video source={{ uri: attachment.fileLocation }}
            className="w-full h-full rouned-xl mt-3 object-center"
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
              <ImageBackground source={{ uri: thumbnail }} className="w-52 h-72 rounded-[35px] my-5 overflow-hidden" resizeMode='cover' />
              <View className="w-12 h-12 absolute"><AntDesign name="play" size={30} color="white" /></View>
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

      <Text className="text-2xl pt-2">{caption}</Text>

      {/* attachments */}
      {
        attachments.length > 0 &&
        <View className="mt-3 h-[300px]">
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