import * as SecureStore from 'expo-secure-store'
import { customAlert } from "./alerts"
import api from "./api"

const getToken = async () => {
  let token = await SecureStore.getItemAsync('token') || null
  return token
}

export const dataFetcher = async (apiEndpoint) => {
  try {
    let result = await api.get(apiEndpoint, { headers: { token: await getToken() } })
    return result
  } catch (error) {
    customAlert('ERROR!!', error.message)
    return null
  }
}

export const dataSender = async (apiEndpoint, data) => {
  try {
    let result = await api.post(apiEndpoint, data,{ headers: { token: await getToken() } })
    
    if(result?.status == 1){
      customAlert("Success !!", result.data)
    }
    return result
  } catch (error) {
    customAlert('ERROR!!', error.message)
    return null
  }
}

export const reactionSender = async (apiEndpoint, data) => {
  try {
    let result = await api.post(apiEndpoint, data, { headers: { token: await getToken() } })
    return result
  } catch (error) {
    customAlert('ERROR!!', error.message)
    return null
  }
}