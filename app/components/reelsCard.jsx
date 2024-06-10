import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { generateThumbnail } from '../scripts/getThumbnail'

const ReelsCard = ({ reels: { _id, author, caption, createdAt, currentUserReaction, reactionCount, commentCount, authorDetails: { firstName, lastName, profileImg }, attachments } }) => {

  const screenWidth = Dimensions.get('window').width
  const [thumbnail, setThumbnail] = useState("https://fakeimg.pl/600x400?text=+")

  // get the thumbnail
  useEffect(() => {
    (async () => {
      let result = await generateThumbnail(attachments[0].fileLocation)
      setThumbnail(result)
    })()
  }, [])

  return (
    <View className="h-[300] rounded-md overflow-hidden mx-2" style={{ width: (screenWidth / 2) - 10 }}>
      <TouchableOpacity
        className="w-full h-full"
      >
        <Image source={{ uri: thumbnail }} className="w-full h-full" />
      </TouchableOpacity>
    </View>
  )
}

export default ReelsCard