import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons';
import { customAlert } from '../scripts/alerts';

const FormTextInput = ({ regex, title, placeholder, value, validationMsg, clear, containerStyle }) => {

  const [showPass, setShowPass] = useState(false)
  const [text, setText] = useState("")

  // validate the texts
  const validate = (input) => {
    if (input == "") return
    const isValid = regex.test(input)
    if(!isValid) return customAlert("ERROR !!", validationMsg ? validationMsg : "something went wrong")
    value(input)
  }

  // clear fields
  useEffect(() => {
    if(clear == true){
      setText("")
    }
  }, [clear])

  return (
    <View className={containerStyle ? containerStyle : "mt-7"}>
      <Text className="text-[18px] font-pmedium">{title && title}</Text>
      <View className="w-full h-14 border-b-2 border-b-grayColor items-center flex-row focus:border-b-purpleColor">
        <TextInput
          className="flex-1 text-left font-psemibold text-xl"
          value={text}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={setText}
          onEndEditing={() => validate(text.trim())}
          secureTextEntry={(title == "Password" || title == "Confirm Password") && !showPass}
        />

        {
          (title == "Password" || title == "Confirm Password") &&
          <TouchableOpacity onPress={() => setShowPass(!showPass)} className={`p-3 bg-lightGrayColor2 rounded-lg ${showPass && "bg-purpleColor"}`}>
              {showPass && <Feather name="eye-off" size={20} color={`${showPass ? "white" : "black"}`} />}
            {!showPass && <Feather name="eye" size={20} color="black" />}
          </TouchableOpacity>
        }
      </View>
    </View>
  )
}

export default FormTextInput