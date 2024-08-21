import { View, Text, Image, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router, Stack, useLocalSearchParams, useNavigation } from 'expo-router'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import CustomButton from '../../components/CustomButton'
import authStore from '../../constants/authStore'
import { getSocket } from '../../constants/socketConnection'
import { dataFetcher } from '../../scripts/apiCaller'
import { messageUrl } from '../../scripts/endpoints'

const SingleMessage = () => {

  const { _id, firstName, lastName, profileImg } = useLocalSearchParams()
  const navigation = useNavigation()
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const scrollViewRef = useRef(null)
  const limit = 30
  const {profile} = authStore()
  const socket = getSocket()

  const [msg, setMsg] = useState({
    to: _id,
    message: "",
  })

  // get the last messages
  useEffect(() =>{
    (async () => {
      let result = await dataFetcher(messageUrl + `/${_id}/${page}/${limit}`)
      if(result == null && result?.status == 0) return
      let reversedMessages = result?.data.reverse()
      setData(prev => [...prev,...reversedMessages])
    })()
  }, [])

  // sending a message
  const sendMessage = () => {
    socket.emit("send-message", msg)
    setData(prev => [...prev, {from: profile?._id, ...msg}])
    setMsg({
      to: _id,
      message: "",
    })
  }

  // receieve a message
  useEffect(() => {
    socket.on("receive-message", (receivedMsg) => {
      setData(prev => [...prev, receivedMsg])
    })
  }, [])

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [data])


  return (
    <View className="flex-1 bg-lightGrayColor2">

      {/* change header with user info */}
      <Stack.Screen options={{
        headerLeft: () => (
          <View className="flex-1 max-h-[80px] items-center flex-row py-2">
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
              <Text><Ionicons name="arrow-back-outline" size={30} color="black" /></Text>
            </TouchableOpacity>

            {/* user image */}
            <TouchableOpacity
              onPress={() => router.push({
                pathname: 'pages/userProfileById',
                params: { userId: _id, userFirstName: firstName, userLastName: lastName, userProfileImg: profileImg }
              })}
            >
              <Image source={{ uri: profileImg }} className="w-[50px] h-[50px] rounded-full" />
            </TouchableOpacity>

            <Text className="pl-2 font-psemibold text-xl">{firstName} {lastName}</Text>

          </View>
        ),
      }} />


      {/* view box*/}
      <View className="flex-1 justify-center">
        <ScrollView 
          className="flex-1"
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <View className="flex-1 px-2 py-1">
            {
              data.length > 0 && 
                data.map((e, index) => (
                  <View 
                    key={index}
                    className={`w-fit max-w-[70%] my-1 p-2 rounded-md ${profile?._id == e.from ? "bg-purpleColor self-end" : "bg-darkGrayColor self-start"}`}
                  >
                    <Text key={index} className={`text-white text-xl`}>{e.message}</Text>
                  </View>
                ))
            }
          </View>
        </ScrollView>
      </View>

      {/* chat box*/}
      <View className="flex-1 max-h-[80px] bg-lightGrayColor2 justify-center px-2 border-t border-gray-500 flex-row items-center">
        <TextInput 
          placeholder='Enter message'
          className="border border-gray-500 rounded-md p-2 font-pmedium text-[17px] h-[55px] flex-grow"
          onChangeText={(e) => setMsg({...msg, ['message']: e})}
          value={msg.message}
        />

        <CustomButton 
          title={<FontAwesome5 name="telegram-plane" size={30} color="white" />}
          containerStyles={"w-[55px] h-[55px] bg-purpleColor justify-center items-center rounded-md ml-2"}
          handlePress={sendMessage}
        />
      </View>


    </View>
  )
}

export default SingleMessage 