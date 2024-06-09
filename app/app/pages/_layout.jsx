import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const PageLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='profile' options={{
        headerTitle: "Profile",
        headerTitleStyle: {
          fontFamily: "Poppins-SemiBold",
          fontSize: 25,
        }
      }} />

      <Stack.Screen name='showComments' options={{
        headerTitle: "Comments",
        headerTitleStyle: {
          fontFamily: "Poppins-SemiBold",
          fontSize: 25,
        }
      }} />

      <Stack.Screen name='updateComment' options={{
        headerTitle: "Update comments",
        headerTitleStyle: {
          fontFamily: "Poppins-SemiBold",
          fontSize: 25,
        }
      }} />

      <Stack.Screen name='userProfileById' options={{
        headerTitle: "",
        headerTitleStyle: {
          fontFamily: "Poppins-SemiBold",
          fontSize: 25,
        }
      }} />

    </Stack>
  )
}

export default PageLayout