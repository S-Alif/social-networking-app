import {create} from 'zustand'


export default authStore = create((set) => ({
  profile: null,

  setProfile: async (profileData) => {
    set({ profile: profileData })
  }
}))