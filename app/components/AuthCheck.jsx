import { useEffect } from 'react'
import authStore from '../constants/authStore'
import { router } from 'expo-router'

const AuthCheck = ({ children }) => {

  const { profile } = authStore()

  useEffect(() => {
    if (profile == null || !profile?._id) {
      router.replace('/login')
    }
  }, [profile])

  if (profile == null || !profile?._id) {
    return null
  }

  return children
}

export default AuthCheck