import { View, Modal, TouchableWithoutFeedback, Image, Dimensions } from 'react-native'
import React from 'react'

const ImagePopupModal = ({ imgUrl, visible, onClose }) => {
  
  const screenWidth = Dimensions.get('window').width;

  return (
    <Modal
      animationType='fade'
      visible={visible}
      onRequestClose={() => onClose(false)}
      transparent={true}
    >
      <TouchableWithoutFeedback onPress={() => onClose(false)}>
        <View className="flex-1 justify-center items-center bg-[#1a1b1cb2] px-4">
          <View className="flex-1 px-2" style={{width: screenWidth - 20, height: 'auto'}}>
            <Image source={{uri: imgUrl}} className="w-full h-full object-contain" resizeMode='contain' />
          </View>
        </View>
      </TouchableWithoutFeedback>
      
    </Modal>
  )
}

export default ImagePopupModal