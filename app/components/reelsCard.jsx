import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { generateThumbnail } from '../scripts/getThumbnail'
import { AntDesign, FontAwesome5 } from '@expo/vector-icons'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

const ReelsCard = ({ reels: { _id, author, caption, createdAt, currentUserReaction, reactionCount, commentCount, authorDetails: { firstName, lastName, profileImg }, attachments } }) => {

  const [thumbnail, setThumbnail] = useState("https://fakeimg.pl/600x400?text=+")
  const [open, setOpen] = useState(false)

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
        className="w-full h-full rounded-md overflow-hidden relative"
        activeOpacity={0.8}
        onPress={() => setOpen(prev => !prev)}
      >
        <Image source={{ uri: thumbnail }} className="w-full h-full rounded-md" />
        {/* overlay */}
        <View className={`absolute w-full h-full justify-center items-center ${open ? "opacity-1 visible" : "opacity-0 invisible"}`} style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
          <View className="flex-row gap-3">
            <Text className="text-white font-pmedium text-2xl"><AntDesign name="like2" size={24} color="white" /> {reactionCount}</Text>
            <Text className="text-white font-pmedium text-2xl"><FontAwesome5 name="comment-dots" size={24} color="white" /> {commentCount}</Text>
          </View>

          <CustomButton
            title={"Watch threel"}
            containerStyles={"bg-purpleColor w-auto h-[30] mt-3 px-3"}
            textStyles={"text-white font-pmedium"}
            handlePress={() => {
              setOpen(false)
              router.push('/reels')
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default ReelsCard