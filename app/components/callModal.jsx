import { View, Text, Modal, TouchableWithoutFeedback, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RTCPeerConnection, RTCSessionDescription, mediaDevices, RTCIceCandidate, RTCView } from 'react-native-webrtc'
import { customAlert } from '../scripts/alerts'
import CustomButton from './CustomButton'
import { Audio } from 'expo-av'

const CallModal = ({ visible = false, closeModal, socket, user, callType = "audio" }) => {
  const [localStream, setLocalStream] = useState(null)
  const [peerConnection, setPeerConnection] = useState(null)
  const [isReceivingCall, setIsReceivingCall] = useState(null)
  const [incomingCallData, setIncomingCallData] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [onCall, setOnCall] = useState(false)
  const [type, setType] = useState(callType)
  const [calling, setCalling] = useState(false)

  useEffect(() => {
    if (visible) setType(callType)
  }, [visible])

  // Start the call
  const startCall = async () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ],
    })

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', {
          candidate: event.candidate,
          to: user?._id,
        })
      }
    }

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0])
    }

    setPeerConnection(pc)

    let mediaType = { video: false, audio: true }
    if (type === "video") {
      mediaType.video = true
      await Audio.setAudioModeAsync({
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      })
    }
    else {
      await Audio.setAudioModeAsync({
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: true,
      })
    }

    const stream = await mediaDevices.getUserMedia(mediaType)
    setLocalStream(stream)
    stream.getTracks().forEach((track) => pc.addTrack(track, stream))

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    socket.emit('start-call', {
      offer,
      to: user?._id,
      callType: callType,
    })

    setCalling(true)
    setOnCall(true)

    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected') {
        // setOnCall(false)
        endCall()
      }
    }
  }

  // Accept the call
  const acceptCall = async () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ],
    })

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', {
          candidate: event.candidate,
          to: user?._id,
        })
      }
    }

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0])
    }

    setPeerConnection(pc)
    try {
      let mediaType = { video: false, audio: true }
      if (type === "video") {
        mediaType.video = true
        await Audio.setAudioModeAsync({
          staysActiveInBackground: false,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: false,
        })
      }
      else {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: false,
          shouldDuckAndroid: false,
          playThroughEarpieceAndroid: true,
        })
      }

      const stream = await mediaDevices.getUserMedia(mediaType)
      setLocalStream(stream)
      stream.getTracks().forEach((track) => pc.addTrack(track, stream))

      await pc.setRemoteDescription(new RTCSessionDescription(incomingCallData.offer))

      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      socket.emit('answer', {
        answer,
        to: user?._id,
      })

      setIsReceivingCall(false)
      setOnCall(true)

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'disconnected') {
          // setOnCall(false)
          endCall()
        }
      }
    } catch (error) {
      console.error('Error accepting call:', error)
      customAlert('Error', 'Failed to accept the call. Please try again.')
    }
  }

  // End the call
  const endCall = async () => {
    setRemoteStream(null)
    setIsReceivingCall(false)
    if (peerConnection) {
      peerConnection.close()
    }
    setPeerConnection(null)
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
    }
    setLocalStream(null)
    setIsReceivingCall(null)
    setOnCall(false)
    setCalling(false)
  }

  // socket connections
  useEffect(() => {
    socket.on('offer', async ({ offer, from, callType }) => {
      setType(callType)
      setIsReceivingCall(true)
      setCalling(false)
      setIncomingCallData({ offer, from })
    })

    socket.on('answer', async ({ answer }) => {
      if (peerConnection) {
        setCalling(false)
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
      }
    })

    socket.on('candidate', async ({ candidate }) => {
      if (peerConnection && candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      }
    })

    socket.on("end-call", async () => {
      const devices = await mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput')

      for (const device of videoDevices) {
        try {
          const stream = await mediaDevices.getUserMedia({ video: { deviceId: device.deviceId } });
          stream.getTracks().forEach(track => track.stop());
        } catch (error) {
          console.log(`Failed to stop device ${device.deviceId}:`, error);
        }
      }
      endCall()
    })

    return () => {
      socket.off('offer')
      socket.off('answer')
      socket.off('candidate')
      socket.off('end-call')
    }
  }, [socket, peerConnection])


  return (
    <Modal animationType='slide' visible={visible || isReceivingCall || onCall} transparent={true}>
      <TouchableWithoutFeedback onPress={() => {
        if (onCall) return
        closeModal()
      }}>
        <View className="flex-1 w-full h-screen justify-end">
          <View className="flex-1 w-full h-full bg-lightGrayColor border-t-2 border-purpleColor rounded-t-lg relative">

            {/* User info section */}
            {(!onCall || (onCall && type == "audio")) && (
              <View className="pt-10 mx-auto">
                <Image source={{ uri: user?.profileImg }} className="w-[120] h-[120] rounded-full mx-auto" />
                <Text className="text-center mt-5 font-psemibold text-2xl">{user?.firstName} {user?.lastName}</Text>
              </View>
            )}

            {isReceivingCall && <Text className="text-xl text-center mt-10">Incoming Call...</Text>}
            {calling && <Text className="text-xl text-center mt-10">Calling ..</Text>}
            {onCall && type == "audio" && <Text className="text-xl text-center mt-10">In Call</Text>}
            

            {isReceivingCall != null && isReceivingCall ? (
              <View className="w-full px-2">
                <CustomButton
                  title={"Accept"}
                  handlePress={acceptCall}
                  containerStyles={"w-full h-[50] bg-green-500 mt-10"}
                  textStyles={"font-pmedium text-white text-xl"}
                />
                <CustomButton
                  title={"Reject"}
                  handlePress={() => {
                    endCall()
                    socket.emit("end-call-confirm", { to: user?._id })
                  }}
                  containerStyles={"w-full h-[50] bg-red-500 mt-4"}
                  textStyles={"font-pmedium text-white text-xl"}
                />
              </View>
            ) : (
              <>
                {onCall && type === "video" && (
                  <View className="flex-1">
                    {remoteStream && (
                      <RTCView
                        streamURL={remoteStream.toURL()}
                        className="flex-1"
                        style={{ zIndex: 1 }}
                        objectFit="cover"
                        mirror={true}
                        zOrder={1}
                      />
                    )}

                    {localStream && (
                      <RTCView
                        streamURL={localStream.toURL()}
                        className="w-32 h-44 absolute top-10 right-4 border-2 border-white rounded-lg z-10"
                        style={{ zIndex: 10 }}
                        objectFit="cover"
                        mirror={true}
                        zOrder={2}
                      />
                    )}
                  </View>
                )}

                {!onCall && (
                  <CustomButton
                    title={type + " Call"}
                    handlePress={startCall}
                    containerStyles={"w-[98%] h-[50] bg-purpleColor mt-10 ml-1 mr-1"}
                    textStyles={"font-pmedium text-white text-xl capitalize"}
                  />
                )}
                {onCall && (
                  <View className="absolute bottom-4 w-full px-2" style={{ zIndex: 20 }}>
                    <CustomButton
                      title={"End Call"}
                      handlePress={() => {
                        endCall()
                        socket.emit("end-call-confirm", { to: user?._id })
                      }}
                      containerStyles={"w-full h-[50] bg-red-500 mt-4"}
                      textStyles={"font-pmedium text-white text-xl"}
                    />
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default CallModal