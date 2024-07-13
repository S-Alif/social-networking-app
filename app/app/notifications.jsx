import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { notificationUrl } from '../scripts/endpoints'
import authStore from '../constants/authStore'
import { reactionFetcher } from './../scripts/apiCaller';
import { formatDate } from './../scripts/dateFormatter';
import { router } from 'expo-router';

// notification msg
const msgs = {
  postReaction: "reacted on your post",
  postComment: "commented on your post",
  reelsReaction: "reacted on your threel",
  reelsComment: "commented on your threel",
  reuqest: "wants to become your buddy",
  requestAccept: "has accepted you as a buddy",
}

// set the notification msg
const setMsg = (notification) => {
  if (notification?.type == "comment" && notification?.postType == "post") return msgs.postComment
  if (notification?.type == "reaction" && notification?.postType == "post") return msgs.postReaction
  if (notification?.type == "comment" && notification?.postType == "reels") return msgs.reelsComment
  if (notification?.type == "reaction" && notification?.postType == "reels") return msgs.reelsReaction
  if (notification?.type == "request") return msgs.reuqest
  if (notification?.type == "request_accept") return msgs.requestAccept
}

// main component
const Notifications = () => {

  const { notifications, getNotification } = authStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => {
      await getNotification()
      setLoading(false)
    })()
  }, [loading])


  return (
    <View className="flex-1 bg-lightGrayColor">
      {
        !loading &&
        <FlatList
          data={notifications}
          keyExtractor={(item) => item?._id}
          extraData={notifications}
          renderItem={({ item }) => (
            <NotificationCard notification={item} />
          )}
          contentContainerStyle={{ paddingVertical: 20 }}
          onRefresh={() => setLoading(true)}
          refreshing={loading}
        />
      }
    </View>
  )
}

export default Notifications

// notification card
const NotificationCard = ({ notification }) => {

  const { notificationCount, setNotificationCount } = authStore()
  const [seen, setSeen] = useState(notification?.seen || false)

  const goToPost = async () => {
    if (seen == false) {
      let seeTheNotification = await reactionFetcher(notificationUrl + "/" + notification?._id)
      if (seeTheNotification != null && seeTheNotification?.status == 1) {
        setSeen(true)
        setNotificationCount(notificationCount - 1)
      }
    }

    if (notification?.postType == "post") return router.push({ pathname: "pages/SinglePost", params: { postId: notification?.postId } })
    if (notification?.postType == "reels") return router.push({ pathname: "/reels", params: { reelsId: notification?.postId } })
    if (notification?.postType == "request") return router.push({ pathname: "pages/userProfileById", params: { userId: notification?.userId } })
  }

  return (
    <TouchableOpacity
      className={`mx-2 mb-3 flex-1 rounded-md border-2 bg-lightGrayColor2 ${seen ? "border-lightGrayColor2" : "border-purpleColor"}`}
      onPress={goToPost}
    >

      {/* user details */}
      <View className="flex-1 h-full flex-row gap-3 items-center px-2 py-2">
        <TouchableOpacity
          onPress={() => router.push({
            pathname: "pages/userProfileById",
            params: { userId: notification?.userId }
          })}
        >
          <Image source={{ uri: notification?.profileImg }} className="w-[55px] h-[55px] rounded-full" />
        </TouchableOpacity>

        <View className="flex-shrink">
          <Text className="text-[18px] font-psemibold">
            {notification?.firstName} {notification?.lastName} <Text className="font-pmedium">{setMsg(notification)}</Text>
          </Text>
          <Text className="text-[12px] font-pbold text-gray-400">{formatDate(notification?.createdAt)}</Text>
        </View>
      </View>

    </TouchableOpacity>
  )
}