import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import TabScreenLayout from '../../components/tabScreenLayout'
import SearchBox from '../../components/searchBox'
import { dataFetcher } from '../../scripts/apiCaller'
import { messageUrl } from '../../scripts/endpoints'
import { router } from 'expo-router'
import authStore from '../../constants/authStore'
import { formatDate } from '../../scripts/dateFormatter'

const MessageList = () => {

  const { newMessage, setNewMsgStatus } = authStore()

  const [list, setList] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [page, setPage] = useState(1)
  const [count, setCount] = useState(0)
  const limit = 10

  const messageList = async (page = 1, refresh = false) => {
    let result = await dataFetcher(messageUrl + `/list/${page}/${limit}`)
    if(result == null || result?.status == 0) return
    if(refresh){
      setList(result?.data?.chatList)
    }
    else{
      setList(prev => [...prev, ...result?.data?.chatList])
    }
    setCount(result?.data?.totalCount)
    setNewMsgStatus(false)
    setRefresh(false)
  }

  // get the list
  useEffect(() => {
    if(!newMessage){
      (async () => {
        await messageList()
      })()
    }
  }, [])

  // refresh the list
  useEffect(() => {
    if (newMessage) {
      (async () => {
        await messageList()
      })()
    }
  }, [newMessage])

  // on refresh
  const onRefresh = async () => {
    setRefresh(true)
    setPage(1)
    await messageList(1, true)
  }

  // handle scroll
  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 80) {
      if((page * limit) >= count) return
      messageList(page + 1)
      setPage(prev => prev + 1)
    }
  }

  return (
    <TabScreenLayout>
      <ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingBottom: 20}}
        refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
      >

        {/* search field */}
        <SearchBox />

        {/* list */}
        {
          list.length > 0 &&
          list.map((e, index) => (
            <MessageListCard user={e} key={index} />
          ))
        }
      </ScrollView>
    </TabScreenLayout>
  )
}

export default MessageList

// message list card
const MessageListCard = ({user}) => {
  const {profile} = authStore()

  return(
    <View className="flex-1 flex-row justify-between items-center w-full px-2 py-3 bg-lightGrayColor2 rounded-md mb-2">

      <TouchableOpacity
        className="flex-1 h-full flex-row gap-3 items-center"
        onPress={() => router.push({ pathname: "pages/singleMessage", params: { _id: user?.userId, firstName: user?.firstName, lastName: user?.lastName, profileImg: user?.profileImg } })}
        activeOpacity={0.7}
      >
        <TouchableOpacity
          onPress={() => router.push({
            pathname: "pages/userProfileById",
            params: { userId: user?.userId, userFirstName: user?.firstName, userLastName: user?.lastName, userProfileImg: user?.profileImg }
          })}
        >
          <Image source={{ uri: user?.profileImg }} className="w-[60px] h-[60px] rounded-full" />
        </TouchableOpacity>

        <View className="flex-1">
          <Text className="text-[20px] font-psemibold pt-2">{user?.firstName} {user?.lastName}</Text>
          <Text className={`text-sm font-pmedium flex-grow ${profile?._id !== user?.latestMessage?.msgUser && !user?.latestMessage?.seen ? "text-black" : "text-gray-400"}`}>
            {user?.latestMessage?.message.substring(0, 20)}{user?.latestMessage?.message.length > 20 && "..."}
          </Text>

          <Text className="w-full text-sm font-pmedium text-gray-400 text-right">{formatDate(user?.latestMessage?.createdAt)}</Text>
        </View>
      </TouchableOpacity>

    </View>
  )
}