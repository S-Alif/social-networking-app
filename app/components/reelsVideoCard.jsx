import { View, Text, Dimensions, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { ResizeMode, Video } from 'expo-av'
import ReelsEngagement from './reelsEngagement'

const height = Dimensions.get('window').height

const ReelsVideoCard = ({ reels: { _id, author, caption, createdAt, currentUserReaction, reactionCount, commentCount, authorDetails: { firstName, lastName, profileImg }, attachments }, isPlaying }) => {

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
    <View className="flex-1 h-full w-full">
      <View className="flex-1 relative">

        {/* video container */}
        <View className="flex-1 w-full aspect-auto relative" style={{ height: height - 20 }}>
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
            className="absolute top-1/2 left-1/2 bg-purpleColor border-2 border-white rounded-full w-[100] h-[100]"
            style={{ transform: [{ translateX: -50 }, { translateY: -50 }] }}
          >
            <Text>{play ? 'Pause' : 'Play'}</Text>
          </TouchableOpacity>
        </View>

        {/* reels engagement */}
        <ReelsEngagement reelsId={{ _id, author }} reaction={currentUserReaction ? currentUserReaction : null} />


      </View>
    </View>
  )
}

export default ReelsVideoCard