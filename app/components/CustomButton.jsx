import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'

const CustomButton = ({title, handlePress, containerStyles, textStyles, isloading}) => {
  return (
    <TouchableOpacity 
      className={`rounded-xl justify-center items-center ${containerStyles ? containerStyles : ""}${isloading ? "opacity-50" : ""}`}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isloading}
    >
      <Text className={textStyles? textStyles : ""}>{title ? title : "CustomButton"} {isloading && <ActivityIndicator size="small" color="#ffff" />}</Text>
    </TouchableOpacity>
  )
}

export default CustomButton