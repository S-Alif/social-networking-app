import { router, useLocalSearchParams, usePathname } from "expo-router"
import { useState } from "react"
import { Text, TextInput, View } from "react-native"
import CustomButton from "./CustomButton"
import { customAlert } from "../scripts/alerts"
import { dataSender } from "../scripts/apiCaller"
import { userUrl } from "../scripts/endpoints"

// password update
const UpdatePass = () => {

  const pathname = usePathname()
  const params = useLocalSearchParams()
  let isProfileSettings = pathname == "/pages/profileSettings"

  const [currentPass, setCurrentPass] = useState("")
  const [newPass, setNewPass] = useState("")
  const [confirmNewPass, setConfirmNewPass] = useState("")

  // validate password
  const validatePass = () => {
    let passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/

    if (isProfileSettings && (currentPass?.trim() == "" || currentPass?.trim()?.length == 0)) {
      return customAlert("ERROR !!", "Current password cannot be empty")
    }
    else if (newPass !== confirmNewPass) {
      return customAlert("ERROR !!", "New passowrds dont match")
    }
    else if (!passRegex.test(newPass)) {
      return customAlert("ERROR !!", "password should be of eight characters and must contain at least one uppecase letter, one lowercase letter, one symbol and one digit")
    }
    return true
  }

  // change the password
  const changePassword = async () => {
    let validation = validatePass()
    if (validation !== true) return
    customAlert("Please wait ...", "Your password is updating")

    let data = {
      currentPass: currentPass,
      newPass: newPass
    }
    let url = userUrl + "/pass-renew/profile"
    if (!isProfileSettings) {
      data.email = params?.email
      url = userUrl + "/pass-renew"
    }
    let result = await dataSender(url, data)
    if (result != null && result?.status == 1) {
      setCurrentPass("")
      setNewPass("")
      setConfirmNewPass("")
    }
    if (!isProfileSettings) router.replace('/login')
  }

  return (
    <View className="flex-1">
      <Text className="font-psemibold text-2xl pb-2 border-b-2 border-b-gray-400 mb-3">Change password</Text>

      {
        isProfileSettings &&
        <TextInput
          className="w-full h-[60] border-2 border-grayColor rounded-lg p-2 font-pmedium text-[18px] focus:border-purpleColor mt-2"
          placeholder="Current password"
          onChangeText={setCurrentPass}
          value={currentPass}
          secureTextEntry
        />
      }
      <TextInput
        className="w-full h-[60] border-2 border-grayColor rounded-lg p-2 font-pmedium text-[18px] focus:border-purpleColor mt-2"
        placeholder="New password"
        onChangeText={setNewPass}
        value={newPass}
        secureTextEntry
      />
      <TextInput
        className="w-full h-[60] border-2 border-grayColor rounded-lg p-2 font-pmedium text-[18px] focus:border-purpleColor mt-2"
        placeholder="confirm new  password"
        onChangeText={setConfirmNewPass}
        value={confirmNewPass}
        secureTextEntry
      />

      <CustomButton
        title={"Change password"}
        containerStyles={"flex-1 w-full h-[50] bg-purpleColor mt-5"}
        textStyles={"text-white font-psemibold text-xl"}
        handlePress={changePassword}
      />
    </View>
  )
}

export default UpdatePass