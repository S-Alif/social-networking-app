import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isloading }) => {
  return (
    <TouchableOpacity
      className={`rounded-xl justify-center items-center ${containerStyles ? containerStyles : ""} ${isloading ? "opacity-70" : ""}`}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isloading}
    >
      <View className="flex-1 justify-center items-center flex-row">
        <Text className={textStyles ? textStyles : ""}>{title ? title : "CustomButton"} </Text>
        {isloading && <ActivityIndicator size="small" color="#ffff" />}
      </View>
    </TouchableOpacity>
  )
}

export default CustomButton