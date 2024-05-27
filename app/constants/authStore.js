import {create} from 'zustand'


export default authStore = create((set) => ({
  token: null,

  // set the token
  setToken: async (token) => {
    set({token: token})
  }
}))