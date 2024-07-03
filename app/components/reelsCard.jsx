import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { generateThumbnail } from '../scripts/getThumbnail'

const ReelsCard = ({ reels: { _id, author, caption, createdAt, currentUserReaction, reactionCount, commentCount, authorDetails: { firstName, lastName, profileImg }, attachments } }) => {

  const [thumbnail, setThumbnail] = useState("https://fakeimg.pl/600x400?text=+")

  // get the thumbnail
  useEffect(() => {
    (async () => {
      let result = await generateThumbnail(attachments[0].fileLocation)
      setThumbnail(result)
    })()
  }, [])

  return (
    <View className="w-full h-[300] rounded-md overflow-hidden">
      <TouchableOpacity
        className="w-full h-full rounded-md overflow-hidden"
      >
        <Image source={{ uri: thumbnail }} className="w-full h-full rounded-md" />
      </TouchableOpacity>
    </View>
  )
}

export default ReelsCard