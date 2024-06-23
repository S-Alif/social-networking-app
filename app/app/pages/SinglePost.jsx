import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const SinglePost = () => {

  const params = useLocalSearchParams()

  return (
    <View>
      <Text>{params?.postId}</Text>
    </View>
  )
}

export default SinglePost