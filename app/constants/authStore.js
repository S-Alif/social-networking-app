import { create } from 'zustand'
import { dataFetcher } from '../scripts/apiCaller'
import { notificationUrl, userUrl } from '../scripts/endpoints'


export default authStore = create((set) => ({
  profile: null,
  notifications: [],
  notificationCount: 0,
  socketConnected: false,
  token: null,

  setToken: (token) => {
    set({ token: token })
  },

  // fetch the user profile
  fetchProfile: async () => {
    let result = await dataFetcher(userUrl + '/profile')
    set({ profile: result?.data })
    if (result?.status == 1) return true
    return false
  },

  // set the profile
  setProfile: async (profileData) => {
    set({ profile: profileData })
  },

  // get notification
  getNotification: async () => {
    let result = await dataFetcher(notificationUrl + "/")
    if (result != null && result?.status == 1) {
      set({ notifications: result?.data })
      set({ notificationCount: result?.data.filter(e => e.seen == false).length })
      return true
    }
    return false
  },
  // set notification count
  increaseNotificationCount: () => {
    set((state) => ({
      notificationCount: state.notificationCount + 1
    }))
  },

  // set socket connection status
  setSocketConnection: (status) => {
    set({ socketConnected: status })
  },

  // set notification
  setNewNotification: (newNotification) => {
    set((state) => ({
      notifications: [...newNotification, ...state.notifications],
    }))
  }
}))