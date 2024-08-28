import { View, Text, Modal, TouchableWithoutFeedback } from 'react-native'
import React from 'react'

const CallModal = ({ visible = false, closeModal }) => {
  return (
    <Modal
      animationType='slide'
      visible={visible}
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View className="flex-1 w-full h-screen justify-end">
          <View className="flex-1 w-full max-h-[75%] bg-lightGrayColor px-2 border-t-2 border-purpleColor rounded-t-lg">
            <Text className="text-gray-400 font-psemibold text-2xl text-center pt-10">In progress</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default CallModal