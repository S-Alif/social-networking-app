import { View, Text, ScrollView, TextInput, ActivityIndicator, Image } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { dataFetcher, dataSender } from './../../scripts/apiCaller';
import { userUrl } from './../../scripts/endpoints';
import { customAlert } from '../../scripts/alerts';
import AuthTabScreen from '../../components/authTabScreen';
import CustomButton from '../../components/CustomButton';
import { router } from 'expo-router';

const FindProfile = () => {

  const [email, setEmail] = useState("")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadMail, setLoadMail] = useState(false)

  // find user profile
  const findUserProfile = async () => {
    let mailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com)$/
    if (!mailRegex.test(email)) return customAlert("ERROR !!", "Enter a valid email")
    setLoading(true)
    let result = await dataFetcher(userUrl + "/forget-pass-profile/" + email)
    if (result != null && result?.status == 1) setUser(result?.data)
    setLoading(false)
  }

  // send mail and go to otp verification screen
  const sendMailAndGotoOtpVerifyScreen = async () => {
    setLoadMail(true)
    let result = await dataSender(userUrl + "/send-otp", { email: email, type: 1 })
    if (result == null || result?.status == 0) return setLoadMail(false)
    setLoadMail(false)
    router.replace({ pathname: "/otpVerify", params: { email: email, type: 1 } })
  }

  return (
    <AuthTabScreen>
      <ScrollView>

        <Text className="text-4xl pt-10 font-pbold mb-5">Find profile</Text>

        <TextInput
          className="w-full h-[60] border-2 border-grayColor rounded-lg p-2 font-pmedium text-[18px] focus:border-purpleColor mt-2"
          placeholder="Type your email"
          onChangeText={setEmail}
          value={email}
          editable={user == null}
        />

        {
          user == null &&
          <CustomButton
            title={"Find"}
            containerStyles={"flex-1 w-full h-[50] bg-purpleColor mt-5"}
            textStyles={"text-white font-psemibold text-xl"}
            handlePress={findUserProfile}
          />
        }

        <View className="flex-1 pt-16">
          {loading && <ActivityIndicator size={'large'} color={"#6835F0"} />}

          {
            user != null &&
            <>
              <Text className="text-2xl text-primary font-psemibold pb-3 border-b border-b-darkGrayColor mb-5">User profile</Text>
              <View className="flex-1 h-full flex-row gap-3 items-center">
                <View>
                  <Image source={{ uri: user?.profileImg }} className="w-[100px] h-[100px] rounded-full" />
                </View>

                <View>
                  <Text className="text-2xl font-pbold">{user?.firstName} {user?.lastName}</Text>
                </View>
              </View>

              <View className="flex-1 flex-row mt-5 justify-between items-center">
                <CustomButton
                  title={"Not you ?"}
                  containerStyles={"flex-1 w-1/2 h-[50] bg-grayColor mr-1"}
                  textStyles={"text-white font-psemibold text-xl"}
                  handlePress={() => {
                    setUser(null)
                    setEmail("")
                  }}
                />

                <CustomButton
                  title={"Next"}
                  containerStyles={"flex-1 w-1/2 h-[50] bg-greenColor ml-1"}
                  textStyles={"text-white font-psemibold text-xl"}
                  isloading={loadMail}
                  handlePress={sendMailAndGotoOtpVerifyScreen}
                />
              </View>
            </>
          }
        </View>

      </ScrollView>
    </AuthTabScreen>
  )
}

export default FindProfile