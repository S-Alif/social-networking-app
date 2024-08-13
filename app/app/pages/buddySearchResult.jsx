import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const BuddySearchResult = () => {

  const params = useLocalSearchParams()

  return (
    <View>
      <Text>{params?.searchText}</Text>
    </View>
  )
}

export default BuddySearchResult