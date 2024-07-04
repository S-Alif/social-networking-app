import React from 'react'
import { Stack } from 'expo-router'
import AuthCheck from '../../components/AuthCheck'

const PageLayout = () => {

  const headerStyles = {
    fontFamily: "Poppins-SemiBold",
    fontSize: 25,
  }

  return (
    <AuthCheck>
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

        <Stack.Screen name='editProfile' options={{
          headerTitle: "Edit your profile",
          headerTitleStyle: headerStyles
        }} />

        <Stack.Screen name='profileSettings' options={{
          headerTitle: "Settings",
          headerTitleStyle: headerStyles
        }} />

        <Stack.Screen name='SinglePost' options={{
          headerTitle: "",
          headerTitleStyle: headerStyles
        }} />

        <Stack.Screen name='updatePost' options={{
          headerTitle: "Update post",
          headerTitleStyle: headerStyles
        }} />

      </Stack>
    </AuthCheck>
  )
}

export default PageLayout