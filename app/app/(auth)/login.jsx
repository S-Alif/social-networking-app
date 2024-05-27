import { View, Text, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import AuthTabScreen from './../../components/authTabScreen';
import FormTextInput from '../../components/textInput';

const Login = () => {

  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")

  console.log(email, pass)

  return (
    <AuthTabScreen>

      <Text className="text-5xl pt-10 font-pbold">Welcome back !!</Text>
      <Text className="text-2xl text-grayColor">We've missed you</Text>

      {/* form inputs */}
      <View className="flex-1 mt-10">

        <FormTextInput
          title={"Email"}
          placeholder={"Enter your email"}
          validationMsg={"Enter a valid email"}
          value={setEmail}
          regex={/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com)$/}
        />

        <FormTextInput
          title={"Password"}
          placeholder={"Enter your password"}
          validationMsg={"password should be of eight characters"}
          value={setPass}
          regex={/^.{8,}$/}
        />

      </View>
    </AuthTabScreen>
  )
}

export default Login