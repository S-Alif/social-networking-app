import { View, Text, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { generateThumbnail } from '../scripts/getThumbnail'
import { AntDesign, Entypo, FontAwesome5 } from '@expo/vector-icons'
import CustomButton from './CustomButton'
import { router } from 'expo-router'
import { formDataSender } from './../scripts/apiCaller';
import { postUrl } from '../scripts/endpoints'
import { customAlert } from '../scripts/alerts'

const ReelsCard = ({ reels: { _id, author, caption, createdAt, currentUserReaction, reactionCount, commentCount, authorDetails: { firstName, lastName, profileImg }, attachments }, deleted }) => {

  const [thumbnail, setThumbnail] = useState("https://fakeimg.pl/600x400?text=+")
  const [open, setOpen] = useState(false)

  // get the thumbnail
  useEffect(() => {
    (async () => {
      let result = await generateThumbnail(attachments[0].fileLocation)
      setThumbnail(result)
    })()
  }, [])

  // delete the post
  const deletePost = async () => {
    Alert.alert("Warning", "Do you want to delete this threel ?", [
      {
        text: "No"
      },
      {
        text: 'Yes',
        onPress: async () => {
          customAlert("Please wait !!", "Your threel is being deleted")
          let result = await formDataSender(postUrl + '/delete/' + _id + "/" + author)
          if (result != null && result?.status == 1) deleted(_id)
        },
      }
    ])
  }

  // option alert
  const optionAlert = async () => {
    Alert.alert("Delete threels", "", [
      {
        text: "No",
      },
      {
        text: 'Yes',
        onPress: async () => await deletePost(),
      }
    ], { cancelable: true })
  }

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
              router.push({ pathname: '/reels', params: { reelsId: _id } })
            }}
          />

          <CustomButton
            title={<Entypo name="dots-three-vertical" size={20} color="white" />}
            containerStyles={"w-auto h-[30] mt-3 px-3 absolute top-2 right-2"}
            handlePress={optionAlert}
          />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default ReelsCard