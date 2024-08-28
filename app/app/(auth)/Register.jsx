import { View, Text, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import AuthTabScreen from '../../components/authTabScreen'
import FormTextInput from '../../components/textInput'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { customAlert } from '../../scripts/alerts'
import { dataSender } from '../../scripts/apiCaller'
import { userUrl } from '../../scripts/endpoints'

const Register = () => {

  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    pass: "",
  })
  const [clearField, setClearField] = useState(false)

  // registration
  const handleRegistration = async () => {
    if (data.email == "" || data.firstName == "" || data.lastName == "" || data.pass == "") {
      return customAlert("ERROR !!", "Please fill all the data")
    }

    setLoading(true)

    let registerAccount = await dataSender(userUrl + "/register", data)
    if (registerAccount == null) return

    setLoading(false)


    let sendOtp = await dataSender(userUrl + "/send-otp", { email: data?.email, type: 0 })
    if (sendOtp == null) {
      customAlert("ERROR !!", "There was an error sending verification email. Please log in to your account and verify from there")
    }

    // clear all fields
    setData({
      firstName: "",
      lastName: "",
      email: "",
      pass: "",
    })

    setClearField(true)

    // show alert that email has been sent and redirected to otp verification page
    Alert.alert(
      "Code sent",
      "A verificaiton code has been sent to your account",
      [
        {
          text: "verify code",
          onPress: () => router.replace({ pathname: "/otpVerify", params: { email: data?.email, type: 0 } })
        }
      ]
    )
  }

  return (
    <AuthTabScreen>

      <ScrollView className="flex-1">

        <Text className="text-4xl pt-10 font-pbold">Welcome to the circle</Text>
        <Text className="text-2xl text-grayColor pt-3">Create an account</Text>

        {/* form */}
        <View className="flex-1 mt-8">
          {/* first name */}
          <FormTextInput
            title={"First name"}
            placeholder={"Enter your first name"}
            validationMsg={"name should be of at least 2 characters"}
            value={(e) => setData({ ...data, firstName: e })}
            regex={/^.{2,}$/}
            clear={clearField}
          />

          {/* last name */}
          <FormTextInput
            title={"Last name"}
            placeholder={"Enter your last name"}
            validationMsg={"name should be of at least 2 characters"}
            value={(e) => setData({ ...data, lastName: e })}
            regex={/^.{2,}$/}
            clear={clearField}
          />

          {/* email */}
          <FormTextInput
            title={"Email"}
            placeholder={"Enter your email"}
            validationMsg={"Enter a valid email"}
            value={(e) => setData({ ...data, email: e.toLowerCase() })}
            regex={/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com)$/}
            clear={clearField}
          />

          {/* password */}
          <FormTextInput
            title={"Password"}
            placeholder={"Enter your password"}
            validationMsg={"password should be of eight characters and must contain at least one uppecase letter, one lowercase letter, one symbol and one digit"}
            value={(e) => setData({ ...data, pass: e })}
            regex={/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/}
            clear={clearField}
          />

          {/* buttons */}
          <CustomButton
            title={"Register account"}
            handlePress={handleRegistration}
            isloading={loading}
            containerStyles={"bg-purpleColor min-h-[50] my-10"}
            textStyles={"text-lightGrayColor2 text-xl font-pmedium"}
          />

          {/* go to regsiter page */}
          <View className="justify-center pb-10 flex-row gap-2">
            <Text className="text-lg font-pmedium text-darkGrayColor">
              Already have an account ?
            </Text>

            <Link href={"/login"} className='text-lg font-psemibold text-purpleColor'>Log in</Link>
          </View>

        </View>
      </ScrollView>

    </AuthTabScreen>
  )
}

export default Register