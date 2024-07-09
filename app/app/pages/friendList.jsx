import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather, FontAwesome5 } from '@expo/vector-icons'
import { dataFetcher } from '../../scripts/apiCaller'
import { useLocalSearchParams } from 'expo-router'
import { engageMentUrl, userUrl } from '../../scripts/endpoints'
import FriendListCard from '../../components/friendListCard'

const FriendList = () => {

  const params = useLocalSearchParams()

  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState(1)

  // get friend requests
  useEffect(() => {
    (async () => {
      let friendList = await dataFetcher(userUrl + "/friends/" + params?.userId)
      if (friendList != null && friendList?.status == 1) setFriends(friendList?.data)

      if (params?.type == 0) {
        let requestList = await dataFetcher(engageMentUrl + "/fetch-request")
        if (requestList != null && requestList?.status == 1) setRequests(requestList?.data)
      }
    })()
  }, [])

  // remove unfriended friend from list
  const removeUnfriendedFriend = (id) => {
    setFriends(prev => prev.filter(e => e._id !== id))
  }

  // rejected request remove
  const removeRejectedFriend = (id) => {
    setRequests(prev => prev.filter(e => e._id !== id))
  }

  // add accepted request to list
  const addAcceptedRequest = (data) => {
    setFriends(prev => [...prev, ...[data]])
    setRequests(prev => prev.filter(e => e._id !== data?._id))
  }


  return (
    <View className="flex-1 bg-lightGrayColor">
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* tab buttons */}
        {
          params?.type == 0 &&
          <View className="flex-1 flex-row justify-between items-center w-full px-2 py-6 bg-lightGrayColor">

            <TouchableOpacity onPress={() => setTab(1)} className={`w-1/2 items-center border border-purpleColor py-2 ${tab == 1 ? "bg-purpleColor" : "bg-lightGrayColor2"} rounded-l-md`}>
              <FontAwesome5 name="user-friends" size={24} color={`${tab == 1 ? "#F3F6F6" : "#000000"}`} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setTab(2)} className={`w-1/2 items-center border border-purpleColor py-2 ${tab == 2 ? "bg-purpleColor" : "bg-lightGrayColor2"} rounded-r-md`}>
              <Feather name="user-plus" size={25} color={`${tab == 2 ? "#F3F6F6" : "#000000"}`} />
            </TouchableOpacity>

          </View>
        }
        {
          params?.type == 1 &&
          <Text className="font-psemibold text-2xl pb-2 my-3 mx-2 border-b-2 border-b-darkGrayColor">Friend list</Text>
        }

        {/* display friend list */}
        <View className={`px-2 ${tab == 1 ? "flex-1" : "hidden"}`}>
          <DisplayFriendList friendList={friends} type={params?.type} unfriend={removeUnfriendedFriend} />
        </View>

        <View className={`px-2 ${tab == 2 ? "flex-1" : "hidden"}`}>
          <DisplayRequestList requestList={requests} type={params?.type} removeFriend={removeRejectedFriend} addFriend={addAcceptedRequest} />
        </View>

      </ScrollView>
    </View>
  )
}

export default FriendList

// friend list
const DisplayFriendList = ({ friendList, unfriend, type }) => {

  return (
    <>
      {
        friendList?.length == 0 && <Text className="text-center pt-3 text-xl font-pmedium">{type == 0 && "You have "}no buddies</Text>
      }
      {
        friendList?.length > 0 &&
        friendList.map((e, index) => (
          <FriendListCard data={e} unfriend={unfriend} key={index} type={type} listType={0} />
        ))
      }
    </>
  )
}

// request list
const DisplayRequestList = ({ requestList, addFriend, removeFriend, type }) => {

  return (
    <>
      {
        requestList?.length == 0 && <Text className="text-center pt-3 text-xl font-pmedium">You have no request</Text>
      }
      {
        requestList?.length > 0 &&
        requestList.map((e, index) => (
          <FriendListCard data={e} key={index} type={type} rejected={removeFriend} aceepted={addFriend} listType={1} />
        ))
      }
    </>
  )
}