import { View, Text, Modal, TouchableWithoutFeedback } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RTCPeerConnection, RTCSessionDescription, mediaDevices, RTCIceCandidate, RTCView } from 'react-native-webrtc'
import { customAlert } from '../scripts/alerts'
import CustomButton from './CustomButton'


const CallModal = ({ visible = false, closeModal, socket, userId, profileId }) => {
  const [localStream, setLocalStream] = useState(null)
  const [peerConnection, setPeerConnection] = useState(null)
  const [isReceivingCall, setIsReceivingCall] = useState(false)
  const [incomingCallData, setIncomingCallData] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)

  // start call
  const startCall = async () => {

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }, // STUN server for NAT traversal
      ],
    })

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', {
          candidate: event.candidate,
          to: userId,
        })
      }
    }

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0])
    }

    setPeerConnection(pc)

    const stream = await mediaDevices.getUserMedia({ video: true, audio: true }) // Capture both video and audio
    setLocalStream(stream)
    stream.getTracks().forEach((track) => pc.addTrack(track, stream))

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    socket.emit('start-call', {
      offer,
      to: userId, // Target user ID for the call
    })

    // Clean up peer connection and local stream when the call ends
    pc.oniceconnectionstatechange = () => {
      if (pc.iceConnectionState === 'disconnected') {
        endCall()
        // socket.emit("end-call", { to: userId })
      }
    }
  }

  // accept call
  const acceptCall = async () => {

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }, // STUN server for NAT traversal
      ],
    })

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', {
          candidate: event.candidate,
          to: userId,
        })
      }
    }

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0])
    }

    setPeerConnection(pc)
    try {
      const stream = await mediaDevices.getUserMedia({ video: true, audio: true }) // Capture both video and audio
      setLocalStream(stream)
      stream.getTracks().forEach((track) => pc.addTrack(track, stream))

      // Set remote offer received from the caller
      await pc.setRemoteDescription(new RTCSessionDescription(incomingCallData.offer))

      // Create an answer for the call
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      // Send the answer to the caller via socket
      socket.emit('answer', {
        answer,
        to: userId,
      })

      setIsReceivingCall(false)

      // Clean up peer connection and local stream when the call ends
      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'disconnected') {
          endCall()
          // socket.emit("end-call", { to: userId })
        }
      }
    } catch (error) {
      console.error('Error accepting call:', error)
      customAlert('Error', 'Failed to accept the call. Please try again.')
    }
  }

  // end the call
  const endCall = () => {
    setRemoteStream(null)
    setIsReceivingCall(false)
    if (peerConnection) {
      peerConnection.close()
      setPeerConnection(null)
    }
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
      setLocalStream(null)
    }
  }

  const rejectCall = () => {
    setIsReceivingCall(false)
    setIncomingCallData(null)
  }

  useEffect(() => {
    socket.on('offer', async ({ offer, from }) => {
      setIsReceivingCall(true)
      setIncomingCallData({ offer, from })
    })

    socket.on('answer', async ({ answer }) => {
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
      }
    })

    socket.on('candidate', async ({ candidate }) => {
      if (peerConnection && candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
      }
    })

    socket.on("end-call", (data) => {
      endCall()
    })

    return () => {
      socket.off('offer')
      socket.off('answer')
      socket.off('candidate')
    }
  }, [socket, peerConnection])


  return (
    <Modal animationType='slide' visible={visible || isReceivingCall} transparent={true}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View className="flex-1 w-full h-screen justify-end">
          <View className="flex-1 w-full max-h-[75%] bg-lightGrayColor px-2 border-t-2 border-purpleColor rounded-t-lg">
            {isReceivingCall ? (
              <>
                <Text className="text-xl text-center mt-10">Incoming Call...</Text>
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
                  }}
                  containerStyles={"w-full h-[50] bg-red-500 mt-4"}
                  textStyles={"font-pmedium text-white text-xl"}
                />
              </>
            ) : (
              <>
                {remoteStream && (
                  <RTCView
                    streamURL={remoteStream.toURL()}
                    style={{ width: '100%', height: 300 }}
                    objectFit="cover"
                    mirror={true} // Set mirror to true for front camera
                  />
                )}
                <CustomButton
                  title={"Call"}
                  handlePress={startCall}
                  containerStyles={"w-full h-[50] bg-purpleColor mt-10"}
                  textStyles={"font-pmedium text-white text-xl"}
                />
                <CustomButton
                  title={"End Call"}
                    handlePress={() => {
                      endCall()
                      socket.emit("end-call-confirm", {to: userId})
                    }}
                  containerStyles={"w-full h-[50] bg-red-500 mt-4"}
                  textStyles={"font-pmedium text-white text-xl"}
                />
              </>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default CallModal