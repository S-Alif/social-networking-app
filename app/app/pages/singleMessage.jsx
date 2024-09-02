import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { router, Stack, useLocalSearchParams, useNavigation } from 'expo-router'
import { Feather, FontAwesome5, Ionicons } from '@expo/vector-icons'
import CustomButton from '../../components/CustomButton'
import authStore from '../../constants/authStore'
import { getSocket } from '../../constants/socketConnection'
import { dataFetcher, reactionSender } from '../../scripts/apiCaller'
import { messageUrl } from '../../scripts/endpoints'
import { customAlert } from '../../scripts/alerts'
import CallModal from '../../components/callModal'

const SingleMessage = () => {

  const { _id, firstName, lastName, profileImg } = useLocalSearchParams()
  const navigation = useNavigation()
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [updating, setUpdating] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [lastSeenMsg, setLastSeenMsg] = useState(null)
  const scrollViewRef = useRef(null)
  const limit = 30
  const {profile} = authStore()
  const socket = getSocket()

  const [msg, setMsg] = useState({
    to: _id,
    message: "",
  })

  // see all the messages
  useEffect(() => {
    (async () => {
      await reactionSender(messageUrl + "/seen-msg/" + _id)
    })()
  }, [])

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
  const sendMessage = async () => {
    let url = messageUrl + "/send-message"
    if(updating) url = messageUrl + "/update/"+msg?._id

    let result = await reactionSender(url, msg)
    if(result == null || result?.status == 0) return customAlert("ERROR !!", result?.data)
    
    if(updating){
      setData(prev => prev.map(e => {
        if(e._id == result?.data?._id) return {...result?.data}
        return e
      }))
      setUpdating(false)
    }else{
      setData(prev => [...prev, result?.data])
    }
    setMsg({
      to: _id,
      message: "",
    })
  }

  // receieve, update, mark as seen or delete a message
  useEffect(() => {
    socket.on("receive-message", async (receivedMsg) => {
      setData(prev => [...prev, receivedMsg])
      await dataFetcher(messageUrl + '/mark-as-seen/' + receivedMsg?._id)
    })
    
    socket.on("update-message", (receivedMsg) => {
      setData(prev => prev.map(e => {
        if (e._id == receivedMsg?._id) return { ...receivedMsg }
        return e
      }))
    })

    socket.on("delete-message", (msdId) => {
      setData(prev => prev.filter(e => e._id !== msdId))
    })

    socket.on("message-seen", (receivedMsg) => {
      setData(prev => prev.map(e => {
        if (e._id == receivedMsg?._id) return { ...receivedMsg }
        return e
      }))
      setLastSeenMsg(receivedMsg?._id)
    })

    return () => {
      socket.off("receive-message")
      socket.off("update-message")
      socket.off("delete-message")
      socket.off("message-seen")
    }
  }, [])

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true })
    }
  }, [data])

  // update message setup
  const updateMessageSetup = (message) => {
    setMsg(message)
    setUpdating(true)
  }

  // delete a message
  const deleteMsg = (msgId) => {
    setData(prev => prev.filter(e => e._id !== msgId))
  }


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

        headerRight: () => (
          <TouchableOpacity
            className="w-[40] h-[40] bg-purpleColor justify-center items-center rounded-md"
            activeOpacity={0.8}
            onPress={() => setModalOpen(true)}
          >
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        )
      }} />


      {/* view box*/}
      <View className="flex-1 justify-center bg-lightGrayColor">
        <ScrollView 
          className="flex-1"
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          <View className="flex-1 px-2 py-1">
            {
              data.length > 0 && 
                data.map((e, index) => (
                  <MessageTextCard 
                    message={e} key={index} 
                    profileId={profile?._id}
                    updated={updateMessageSetup}
                    deleted={deleteMsg}
                  />
                ))
            }
          </View>
        </ScrollView>
      </View>

      {/* chat box*/}
      <View className="flex-1 max-h-[80px] bg-white justify-center px-2 border-t border-gray-500 flex-row items-center">
        <TextInput 
          placeholder='Enter message'
          className="border border-gray-500 rounded-md p-2 font-pmedium text-[17px] h-[55px] flex-grow flex-shrink"
          onChangeText={(e) => setMsg({...msg, ['message']: e})}
          value={msg.message}
          multiline={true}
        />

        <CustomButton 
          title={<FontAwesome5 name="telegram-plane" size={30} color="white" />}
          containerStyles={"w-[55px] h-[55px] bg-purpleColor justify-center items-center rounded-md ml-2"}
          handlePress={() => {
            if(msg?.message.trim().length < 2) return
            sendMessage()
          }}
        />
      </View>

      {/* call modal component */}
      <CallModal visible={modalOpen} closeModal={() => setModalOpen(false)} socket={socket} userId={_id} profileId={profile?._id} />

    </View>
  )
}

export default SingleMessage


// message card
const MessageTextCard = ({ updated, deleted, message, profileId }) => {

  // message options
  const messageOptionAlert = () => {
    Alert.alert("Message options", "", [
      {
        text: "Update",
        onPress: () => {
          updated(message)
        }
      },
      {
        text: "Delete",
        onPress: async () => {
          let result = await reactionSender(messageUrl + "/delete/" + message?._id, {to: message?.to})
          if (result == null || result?.status == 0) return customAlert("ERROR !!", result?.data)
          deleted(message?._id)
        }
      }
    ], {cancelable: true})
  }

  return(
    <View className="my-1">
      {message?.edited && <Text className={`text-black text-[10px] font-psemibold ${profileId == message.from ? "self-end" : "self-start"}`}>edited</Text>}

      <View 
        className={`w-fit max-w-[70%] p-2  rounded-md ${profileId == message.from ? "bg-purpleColor self-end" : "bg-darkGrayColor self-start"} flex-row`}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onLongPress={() => {
            if (profileId !== message?.from) return
            messageOptionAlert()
          }}
        >
          <Text className={`text-white text-xl font-pmedium`}>{message.message}</Text>
        </TouchableOpacity>

        {
          profileId == message?.from && <Text className="self-end ml-1"><Feather name="check" size={10} color={message?.seen ? "white" : "grey"} /></Text>
        }
      </View>

    </View>
  )
}