import { View, Text, SafeAreaView } from 'react-native'
import React, { useState } from 'react'
import AuthTabScreen from './../../components/authTabScreen';
import FormTextInput from '../../components/textInput';
import CustomButton from '../../components/CustomButton';
import { customAlert } from '../../scripts/alerts';
import { Link } from 'expo-router';
import api from '../../scripts/api';
import { userUrl } from '../../scripts/endpoints';
import * as SecureStore from 'expo-secure-store'
import { dataSender } from '../../scripts/apiCaller';

const Login = () => {

  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (email == "" || pass == "") return customAlert("ERROR !!", "All data is required")
    setLoading(true)
    let result = await dataSender(userUrl + "/login", { email, pass })
    if(result != null) {
      await SecureStore.setItemAsync('token', result.token)
    }
    setLoading(false)
  }


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

        {/* forgot password */}
        <Text className="mt-10 font-psemibold text-lg text-purpleColor">Forgot Password ?</Text>

        {/* buttons */}
        <CustomButton
          title={"Log in"}
          handlePress={handleLogin}
          isloading={loading}
          containerStyles={"bg-purpleColor min-h-[50] my-10"}
          textStyles={"text-lightGrayColor2 text-xl font-pmedium"}
        />

        {/* go to regsiter page */}
        <View className="justify-center pt-5 flex-row gap-2">
          <Text className="text-lg font-pmedium text-darkGrayColor">
            Don't have account ?
          </Text>

          <Link href={"/register"} className='text-lg font-psemibold text-purpleColor'>Sign Up</Link>
        </View>

      </View>
    </AuthTabScreen>
  )
}

export default Login