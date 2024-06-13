import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const PageLayout = () => {

  const headerStyles = {
    fontFamily: "Poppins-SemiBold",
    fontSize: 25,
  }

  return (
    <Stack>
      <Stack.Screen name='profile' options={{
        headerTitle: "Profile",
        headerTitleStyle: headerStyles
      }} />

      <Stack.Screen name='showComments' options={{
        headerTitle: "Comments",
        headerTitleStyle: headerStyles
      }} />

      <Stack.Screen name='updateComment' options={{
        headerTitle: "Update comments",
        headerTitleStyle: headerStyles
      }} />

      <Stack.Screen name='userProfileById' options={{
        headerTitle: "",
        headerTitleStyle: headerStyles
      }} />

    </Stack>
  )
}

export default PageLayout