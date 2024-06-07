import * as SecureStore from 'expo-secure-store'
import { customAlert } from "./alerts"
import api from "./api"

const getToken = async () => {
  let token = await SecureStore.getItemAsync('token') || null
  return token
}

// normal get requests
export const dataFetcher = async (apiEndpoint) => {
  try {
    let result = await api.get(apiEndpoint, { headers: { token: await getToken() } })
    return result
  } catch (error) {
    if (error.message !== 'Session expired') {
      customAlert('ERROR!!', error.message);
    }
    return null
  }
}

// normal post request
export const dataSender = async (apiEndpoint, data) => {
  try {
    let result = await api.post(apiEndpoint, data, { headers: { token: await getToken() } })

    if (result?.status == 1) {
      customAlert("Success !!", result.data)
    }
    return result
  } catch (error) {
    if (error.message !== 'Session expired') {
      customAlert('ERROR!!', error.message);
    }
    return null
  }
}

// post request for requests without any success alerts
export const reactionSender = async (apiEndpoint, data) => {
  try {
    let result = await api.post(apiEndpoint, data, { headers: { token: await getToken() } })
    return result
  } catch (error) {
    if (error.message !== 'Session expired') {
      customAlert('ERROR!!', error.message);
    }
    return null
  }
}

// get request for requests without any success alerts
export const reactionFetcher = async (apiEndpoint) => {
  try {
    let result = await api.get(apiEndpoint, { headers: { token: await getToken() } })
    return result
  } catch (error) {
    if (error.message !== 'Session expired') {
      customAlert('ERROR!!', error.message);
    }
    return null
  }
}

// for sending images and videos as form data
export const formDataSender = async (apiEndpoint, data) => {
  try {
    let result = await api.post(apiEndpoint, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        token: await getToken()
      }
    })

    if (result?.status == 1) {
      customAlert("Success !!", result.data)
    }
    return result
  } catch (error) {
    if (error.message !== 'Session expired') {
      customAlert('ERROR!!', error.message);
    }
    return null
  }
}