import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import authStore from '../constants/authStore'
import { formatDate } from '../scripts/dateFormatter'
import { ResizeMode, Video } from 'expo-av'
import { AntDesign } from '@expo/vector-icons';
import { generateThumbnail } from '../scripts/getThumbnail'
import PostEngagements from './postEngagements'
import RenderHTML from 'react-native-render-html'
import ImagePopupModal from './imagePopupModal'
import Carousel from "pinar";
import { router } from 'expo-router'

const screenWidth = Dimensions.get('window').width;

// attachments
const AttachmentHandler = ({ attachment }) => {

  if (attachment.fileType == "image") {
    const [modal, setModal] = useState(false)

    return (
      <View className="flex-1 h-full" style={{ width: screenWidth - 40 }} >
        <TouchableOpacity activeOpacity={0.5} onPress={() => setModal(true)} style={{ width: screenWidth - 40 }}>
          <Image source={{ uri: attachment.fileLocation }} className="w-full h-full object-contain rounded-lg" />
          <ImagePopupModal imgUrl={attachment.fileLocation} visible={modal} onClose={setModal} />
        </TouchableOpacity>
      </View>
    )
  }
  else {
    
    const [play, setPlay] = useState(false)
    const [thumbnail, setThumbnail] = useState("https://fakeimg.pl/600x400?text=+")

    useEffect(() => {
      (async () => {
        let result = await generateThumbnail(attachment.fileLocation)
        setThumbnail(result)
      })()
    }, [])

    return (
      <View className="flex-1 h-full px-1" style={{ width: screenWidth - 40 }}>
        {play ? (
          <Video source={{ uri: attachment.fileLocation }}
            className="w-full h-full"
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
          <TouchableOpacity className="w-full h-full rounded-xl relative justify-center items-center" activeOpacity={0.7} onPress={() => setPlay(true)}>
            <Image source={{ uri: thumbnail }} className="w-full h-full rounded-lg" />
            <View className="w-12 h-12 absolute"><AntDesign name="play" size={30} color="white" /></View>
          </TouchableOpacity>
        )}
      </View>
    )
  }

}


// cards
const PostCards = ({ post: { _id, author, caption, createdAt, currentUserReaction, reactionCount, commentCount, authorDetails: { firstName, lastName, profileImg }, attachments } }) => {

  const { profile } = authStore()

  return (
    <View className="border border-gray-300 rounded-lg mt-2 bg-lightGrayColor2">

      {/* author details, post date and options */}
      <View className="h-[60px] w-full flex-1 flex-row mt-3 mx-3">
        <View className="flex-1 h-full flex-row gap-3 items-center">
          <TouchableOpacity
            onPress={() => router.push({
              pathname: profile?._id == author ? "pages/profile" : "pages/"+author
            })}
          >
            <Image source={{ uri: profileImg }} className="w-[50px] h-[50px] rounded-full" />
          </TouchableOpacity>

          <View>
            <Text className="text-xl font-pbold">{firstName} {lastName}</Text>
            <Text className="text-[12px] font-pbold text-gray-300">{formatDate(createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* <Text className="text-2xl pt-2">{caption}</Text> */}
      {
        caption &&
        <View className="flex-1 mx-3 py-3">
          <RenderHTML
            contentWidth={Dimensions.get('window').width}
            source={{ html: `<div>${caption}</div>` }}
            tagsStyles={htmlStyles}
          />
        </View>
      }

      {/* attachments */}
      {
        attachments.length > 0 &&
        <View className="flex-1 justify-center items-center my-3 px-3">
          <Carousel
            className={`flex-1 w-full rounded-md relative ${attachments.length > 1 && "mb-4"}`}
            style={{ height: 400 }}
            showsControls={false}
            showsDots={attachments.length > 1 ? true : false}
            dotStyle={styles.dotsStyle}
            activeDotStyle={[styles.dotsStyle, styles.dotsActive]}
          >
            {
              attachments.map((e, index) => (
                <AttachmentHandler attachment={e} key={index} />
              ))
            }
          </Carousel>
        </View>
      }

      <View className="flex-1 flex-row justify-between items-center h-[20] px-3 mt-2 mb-3">
        <Text className="font-pbold text-gray-400"> <AntDesign name="like2" size={24} color="black" /> {reactionCount}</Text>
        <Text className="font-pbold text-gray-400"> Comments: {commentCount}</Text>
      </View>

      <PostEngagements postId={{ _id, author }} reaction={currentUserReaction ? currentUserReaction : null} />

    </View>
  )
}

export default PostCards

const styles = StyleSheet.create({
  dotsStyle:{
    width: 30,
    height: 8,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginHorizontal:4,
    display: 'flex',
    flexDirection: 'row',
    bottom: -50,
    borderWidth: 1.6,
    borderColor: "#6835F0"
  },
  dotsActive:{
    backgroundColor: "#6835F0",
  }
})

const htmlStyles = {
  div: {
    fontSize: 24,
    lineHeight: 32,
  },
  p: {
    fontSize: 24,
    lineHeight: 32,
  },
  b: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'bold',
  },
  i: {
    fontSize: 24,
    lineHeight: 32,
    fontStyle: 'italic',
  },
  ul: {
    fontSize: 24,
    lineHeight: 32,
    paddingLeft: 20,
  },
  ol: {
    fontSize: 24,
    lineHeight: 32,
    paddingLeft: 20,
  },
  li: {
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 10,
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    lineHeight: 28,
  },
  h5: {
    fontSize: 18,
    lineHeight: 26,
  },
  h6: {
    fontSize: 16,
    lineHeight: 24,
  },
  blockquote: {
    fontSize: 24,
    lineHeight: 32,
    paddingLeft: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ccc',
  },
};