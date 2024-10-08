import React from 'react'
import { Stack } from 'expo-router'

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen name='login' options={{ headerShown: false }} />
      <Stack.Screen name='register' options={{ headerShown: false }} />
      <Stack.Screen name='otpVerify' options={{ headerShown: false }} />
      <Stack.Screen name='findProfile' options={{ headerShown: false }} />
      <Stack.Screen name='renewPass' options={{ headerShown: false }} />
    </Stack>
  )
}

export default AuthLayout