import { View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, Modal, TouchableWithoutFeedback, Alert, Linking } from 'react-native'
import React, { useEffect, useState } from 'react'
import authStore from '../constants/authStore'
import { formatDate } from '../scripts/dateFormatter'
import { ResizeMode, Video } from 'expo-av'
import { AntDesign, Entypo, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { generateThumbnail } from '../scripts/getThumbnail'
import PostEngagements from './postEngagements'
import ImagePopupModal from './imagePopupModal'
import Carousel from "pinar";
import { router } from 'expo-router'
import { dataSender } from '../scripts/apiCaller'
import { postUrl } from '../scripts/endpoints'
import { customAlert } from '../scripts/alerts'
import { MarkdownView } from 'react-native-markdown-view'


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
const PostCards = ({ post: { _id, author, caption, createdAt, currentUserReaction, reactionCount, commentCount, authorDetails: { firstName, lastName, profileImg }, attachments }, deleted }) => {

  const { profile } = authStore()

  // delete the post
  const deletePost = async () => {
    Alert.alert("Warning", "Do you want to delete this post ?", [
      {
        text: "No"
      },
      {
        text: 'Yes',
        onPress: async () => {
          customAlert("Please wait !!", "Your post is being deleted")
          let result = await dataSender(postUrl + '/delete/' + _id + "/" + author)
          if (result != null && result?.status == 1) deleted(_id)
        },
      }
    ])
  }

  // option alert
  const optionAlert = async () => {
    Alert.alert("Post options", "", [
      {
        text: "Update",
        onPress: async () => {
          router.push({ pathname: 'pages/updatePost', params: { _id: _id, author: author, caption: caption } })
        }
      },
      {
        text: 'Delete',
        onPress: async () => await deletePost(),
      }
    ], { cancelable: true })
  }

  return (
    <View className="border border-gray-300 rounded-lg mt-2 bg-lightGrayColor2">

      {/* author details, post date and options */}
      <TouchableOpacity
        onPress={() => router.push({ pathname: "pages/SinglePost", params: { postId: _id } })}
        activeOpacity={0.8}
        className="flex-1"
      >

        <View className="h-[60px] w-full flex-1 flex-row mt-3 mx-3">
          <View className="flex-1 h-full flex-row gap-3 items-center">
            <TouchableOpacity
              onPress={() => router.push({
                pathname: profile?._id == author ? "pages/profile" : "pages/userProfileById",
                params: { userId: author, userFirstName: firstName, userLastName: lastName, userProfileImg: profileImg }
              })}
            >
              <Image source={{ uri: profileImg }} className="w-[50px] h-[50px] rounded-full" />
            </TouchableOpacity>

            <View>
              <Text className="text-xl font-pbold">{firstName} {lastName}</Text>
              <Text className="text-[12px] font-pbold text-gray-300">{formatDate(createdAt)}</Text>
            </View>
          </View>

          {
            profile?._id == author &&
            <TouchableOpacity
              className="pr-5 pt-3"
              onPress={optionAlert}
            >
              <Entypo name="dots-three-vertical" size={20} color="black" />
            </TouchableOpacity>
          }
        </View>

        {
          caption &&
          <View className="flex-1 mx-3 py-3">
            <MarkdownView
              onLinkPress={(url) => {
                Linking.openURL(url).catch(error =>
                  console.warn('An error occurred: ', error),
                )
              }}
            >
              {caption}
            </MarkdownView>
          </View>
        }

      </TouchableOpacity>

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

      <PostEngagements postId={{ _id, author, type: "post" }} reaction={currentUserReaction ? currentUserReaction : null} engages={{ reactionCount, commentCount }} />

    </View>
  )
}

export default PostCards


const styles = StyleSheet.create({
  dotsStyle: {
    width: 30,
    height: 8,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginHorizontal: 4,
    display: 'flex',
    flexDirection: 'row',
    bottom: -50,
    borderWidth: 1.6,
    borderColor: "#6835F0"
  },
  dotsActive: {
    backgroundColor: "#6835F0",
  }
})