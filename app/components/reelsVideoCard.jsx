import { View, Text, Dimensions, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ResizeMode, Video } from 'expo-av'
import ReelsEngagement from './reelsEngagement'
import { Fontisto, FontAwesome5 } from '@expo/vector-icons';
import authStore from '../constants/authStore';
import { formatDate } from '../scripts/dateFormatter';
import { router } from 'expo-router';

const height = Dimensions.get('window').height

const ReelsVideoCard = ({ reels: { _id, author, caption, createdAt, currentUserReaction, reactionCount, commentCount, authorDetails, attachments }, isPlaying }) => {

  const videoRef = useRef(null)
  const [play, setPlay] = useState(true)

  const handlePlayPause = async () => {
    const currentPosition = await videoRef.current.getStatusAsync()
    if (play) {
      await videoRef.current.setStatusAsync({ shouldPlay: false, positionMillis: currentPosition.positionMillis })
    } else {
      await videoRef.current.playAsync()
      await videoRef.current.setStatusAsync({ shouldPlay: true, positionMillis: currentPosition.positionMillis })
    }
    setPlay(prev => !prev)
  }

  // play or pause based on current view
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.playAsync()
      } else {
        videoRef.current.stopAsync()
      }
    }
    setPlay(isPlaying)
  }, [isPlaying])

  return (
    <View className="flex-1 w-full bg-black overflow-hidden h-screen pb-[70]" >
      <View className="flex-1 relative">

        {/* video container */}
        <View className="flex-1 w-full h-full relative overflow-hidden">
          <Video
            ref={videoRef}
            source={{ uri: attachments[0].fileLocation }}
            className="w-full h-full"
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls={false}
            shouldPlay={false}
            isLooping
          />

          <TouchableOpacity
            onPress={handlePlayPause}
            className={`absolute top-1/2 left-1/2 w-[300] h-[300] justify-center items-center bg-transparent ${play && "opacity-0"}`}
            style={{ transform: [{ translateX: -150 }, { translateY: -150 }] }}
            activeOpacity={0}
          >
            <View
              className="w-[80] h-[80] justify-center items-center border-2 border-white rounded-full"
              style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            >
              {
                play ? <Fontisto name="pause" size={24} color="white" /> : <FontAwesome5 name="play" size={24} color="white" />
              }
            </View>
          </TouchableOpacity>
        </View>

        {/* reels engagement */}
        <ReelsEngagement reelsId={{ _id, author }} reaction={currentUserReaction ? currentUserReaction : null} />

        {/* author info */}
        <View className="absolute bottom-0 w-full">
          <AuhtorInfo author={authorDetails} authorId={author} createdAt={createdAt} caption={caption ? caption : ""} />
        </View>

      </View>
    </View>
  )
}

export default ReelsVideoCard

// author info
const AuhtorInfo = ({ author: { firstName, lastName, profileImg }, authorId, createdAt, caption }) => {

  const { profile } = authStore()

  return (
    <View className="h-[100] w-full flex-1 mt-3 px-3 pb-2">
      <View className="flex-1 h-full flex-row gap-3 items-center">
        <TouchableOpacity
          onPress={() => router.push({
            pathname: profile?._id == authorId ? "pages/profile" : "pages/userProfileById",
            params: { userId: authorId, userFirstName: firstName, userLastName: lastName, userProfileImg: profileImg }
          })}
        >
          <Image source={{ uri: profileImg }} className="w-[50px] h-[50px] rounded-full" />
        </TouchableOpacity>

        <View>
          <Text className="text-xl font-pbold text-white" style={{ textShadowColor: "rgba(0,0,0,0.8)", elevation: 4, textShadowRadius: 10 }}>{firstName} {lastName}</Text>
          <Text className="text-[12px] font-pbold text-gray-300" style={{ textShadowColor: "rgba(0,0,0,0.8)", elevation: 4, textShadowRadius: 10 }}>{formatDate(createdAt)}</Text>
        </View>
      </View>

      {
        caption != "" &&
        <Text
          className="font-pmedium text-[16px] text-white pt-3 pb-4"
          style={{ textShadowColor: "rgba(0,0,0,0.8)", elevation: 4, textShadowRadius: 10 }}
        >
          {caption}
        </Text>
      }
    </View>
  )
}