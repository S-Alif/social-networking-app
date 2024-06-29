import { create } from 'zustand'
import { dataFetcher } from '../scripts/apiCaller'
import { userUrl } from '../scripts/endpoints'


export default authStore = create((set) => ({
  profile: null,

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
  }
}))