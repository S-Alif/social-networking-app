import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import AuthTabScreen from '../../components/authTabScreen'
import FormTextInput from '../../components/textInput'
import CustomButton from '../../components/CustomButton'
import { customAlert } from '../../scripts/alerts'
import { dataSender } from '../../scripts/apiCaller'
import { userUrl } from '../../scripts/endpoints'

const OtpVerify = () => {

  const params = useLocalSearchParams()
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [counter, setCounter] = useState(300)
  const [clearField, setClearField] = useState(false)

  // handle the verification
  const handleVerification = async () => {
    if(code == "") return customAlert("ERROR !!", "Please enter code")
    setLoading(true)

    let verify = await dataSender(userUrl + "/verify-otp", {email: params?.email, otp: code})
    if(verify != null){
      router.replace('/login')
    }
    setCode("")
    setClearField(true)
    setLoading(false)
  }

  // send verification code again
  const sendCode = async () => {
    setCounter(120)
    let sendOtp = await dataSender(userUrl + "/send-otp", { email: params?.email, type: params?.type })
  }


  // start the counter and end it
  useEffect(() => {
    if (counter > 0) {
      var interval = setInterval(() => {
        setCounter(prevCounter => prevCounter - 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [counter]);


 
  return (
    <AuthTabScreen>
      <Text className="text-4xl pt-10 font-pbold">Verify OTP</Text>
      <Text className="text-2xl text-grayColor pt-3">An authentication code has been sent to <Text className="text-black font-medium">{params?.email}</Text></Text>
      <View className=" bg-grayColor flex justify-center items-center w-full h-12 mt-6 rounded-md">
        <Text className="text-xl text-lightGrayColor">The code will expire in five minutes</Text>
      </View>

      {/* form */}
      <View className="flex-1 mt-8">

        {/* verification code */}
        <FormTextInput
          title={"Verification code"}
          placeholder={"Enter verification code"}
          validationMsg={"The code should be 6 characters"}
          value={setCode}
          regex={/^.{6,}$/}
          clear={clearField}
        />

        {/* buttons */}
        <CustomButton
          title={"Verify code"}
          handlePress={handleVerification}
          isloading={loading}
          containerStyles={"bg-purpleColor min-h-[50] my-10"}
          textStyles={"text-lightGrayColor2 text-xl font-pmedium"}
        />

        {/* show the send code button */}
        <View className="justify-center pb-10 flex-row gap-2">
          {
            counter > 0 ? 
              (<Text className="text-lg font-pmedium text-darkGrayColor">Code sent. Resend code in <Text className='text-lg font-psemibold text-purpleColor'>{counter}s</Text></Text>)
              : (<TouchableOpacity onPress={sendCode}><Text className='text-lg font-psemibold text-purpleColor'>Resend code</Text></TouchableOpacity>)
          }
        </View>
      </View>

    </AuthTabScreen>
  )
}

export default OtpVerify