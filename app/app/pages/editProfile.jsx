import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import authStore from './../../constants/authStore';
import { dataFetcher, dataSender, formDataSender } from '../../scripts/apiCaller';
import { userUrl } from '../../scripts/endpoints';
import * as ImagePicker from 'expo-image-picker';
import { fileChecker } from '../../scripts/fileChecker';
import CustomButton from '../../components/CustomButton';
import { FontAwesome6, Entypo, AntDesign } from '@expo/vector-icons';
import FormTextInput from './../../components/textInput';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatOnlyDate, formatTimestamp } from '../../scripts/dateFormatter';

const EditProfile = () => {

  const { profile, setProfile } = authStore()

  const [newCover, setNewCover] = useState(null)
  const [newProfileImg, setNewProfileImg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    dob: "",
    country: "",
    city: ""
  })
  const [clearField, setClearField] = useState(false)
  const [modal, setModal] = useState(false)

  // set the profile info to state
  useEffect(() => {
    setData({
      _id: profile?._id,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      dob: profile?.dob || "",
      country: profile?.country || "",
      city: profile?.city || ""
    })
  }, [profile])

  // refetch profile after update
  const reFetchProfile = async () => {
    let result = await dataFetcher(userUrl + '/profile')
    if (result != null) return setProfile(result?.data)
    setProfile(null)
  }

  // get image
  const getImageFile = async (setTo) => {
    let files = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      allowsMultipleSelection: false,
      selectionLimit: 1
    })

    if (!files) return
    if (files['assets'].length > 1) return customAlert("ERROR !!", "File limit exceded")
    let checker = fileChecker(files['assets'])
    if (checker.length < 1) return

    if (setTo === "cover") return setNewCover(checker[0])
    setNewProfileImg(checker[0])
  }

  // remove image files
  const removeSelectedImage = (removeFrom) => {
    if (removeFrom === "cover") return setNewCover(null)
    setNewProfileImg(null)
  }

  // update images
  const updateImages = async (setTo) => {
    const formData = new FormData()

    let file
    if (setTo === "cover") file = newCover
    if (setTo === "profile") file = newProfileImg

    formData.append(`file`, {
      uri: file.uri,
      type: file.mimeType,
      name: file.fileName,
    })

    setLoading(true)
    let url = null

    if (setTo === "cover") url = userUrl + "/update/profile-cover"
    if (setTo === "profile") url = userUrl + "/update/profile-image"

    let result = await formDataSender(url, formData)
    if (result !== null && result?.status == 1) {
      if (setTo === "cover") setNewCover(null)
      if (setTo === "profile") setNewProfileImg(null)
      await reFetchProfile()
    }
    setLoading(false)
  }

  // update profile info
  const updateProfileInfo = async () => {
    setLoading(true)
    let result = await dataSender(userUrl + "/update", data)
    if (result != null && result?.status == 1) {
      setData({
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        dob: profile?.dob || "",
        country: profile?.country || "",
        city: profile?.city || ""
      })
    }
    await reFetchProfile()
    setLoading(false)
  }


  return (
    <View className="flex-1 bg-lightGrayColor">
      <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>

        {/* images */}
        <View className="flex-1 w-full h-[250] px-2 pt-2 relative overflow-visible">
          {/* profile cover */}
          <View className="absolute right-2 top-5 z-10 w-[50]">

            <CustomButton
              title={<FontAwesome6 name="pencil" size={24} color="#3D4754" />}
              containerStyles={"w-[40] h-[40] mb-2 rounded-md bg-lightGrayColor2"}
              handlePress={() => getImageFile("cover")}
              isloading={loading}
            />

            {
              newCover !== null &&
              <>
                <CustomButton
                  title={<Entypo name="cross" size={30} color="#3D4754" />}
                  containerStyles={"w-[40] h-[40] mb-2 rounded-md bg-lightGrayColor2"}
                  handlePress={() => removeSelectedImage("cover")}
                  isloading={loading}
                />

                <CustomButton
                  title={<AntDesign name="upload" size={24} color="#3D4754" />}
                  containerStyles={"w-[40] h-[40] mb-2 rounded-md bg-lightGrayColor2"}
                  handlePress={() => updateImages("cover")}
                  isloading={loading}
                />
              </>
            }

          </View>

          <Image source={{ uri: !newCover ? profile?.profileCover : newCover.uri }} className="w-full h-full rounded-lg" />

          {/* profile image */}
          <View className="absolute left-5 bottom-[-131] z-10">
            <View className="w-[150] h-[150] border-4 border-lightGrayColor rounded-full">
              <Image source={{ uri: !newProfileImg ? profile?.profileImg : newProfileImg.uri }} className="w-full h-full rounded-full" />
            </View>

            <View className="flex-1 flex-row pt-4 w-full items-center gap-x-2">
              <CustomButton
                title={"Update profile picture"}
                containerStyles={"w-[160] h-[40] rounded-md bg-purpleColor"}
                textStyles={"font-pmedium text-white text-[17]"}
                handlePress={() => getImageFile("profile")}
                isloading={loading}
              />

              {
                newProfileImg !== null &&
                <>
                  <CustomButton
                    title={<Entypo name="cross" size={30} color="white" />}
                    containerStyles={"w-[40] h-[40] rounded-md bg-purpleColor ml-2"}
                    handlePress={() => removeSelectedImage("profile")}
                    isloading={loading}
                  />

                  <CustomButton
                    title={<AntDesign name="upload" size={24} color="white" />}
                    containerStyles={"w-[40] h-[40] rounded-md bg-purpleColor ml-2"}
                    handlePress={() => updateImages("profile")}
                    isloading={loading}
                  />
                </>
              }
            </View>
          </View>
        </View>

        {/* profile data */}
        <View className="px-4 pt-[170]">
          <Text className="text-2xl font-semibold pb-2 border-b-2 border-b-gray-300">Profile info</Text>

          {/* first name */}
          <FormTextInput
            title={"First name"}
            initialValue={data.firstName ? data.firstName : profile?.firstName}
            placeholder={"Enter your first name"}
            validationMsg={"name should be of at least 2 characters"}
            value={(e) => setData({ ...data, firstName: e })}
            regex={/^.{2,}$/}
            clear={clearField}
          />

          {/* last name */}
          <FormTextInput
            title={"Last name"}
            initialValue={data.lastName ? data.lastName : profile?.lastName}
            placeholder={"Enter your last name"}
            validationMsg={"name should be of at least 2 characters"}
            value={(e) => setData({ ...data, lastName: e })}
            regex={/^.{2,}$/}
            clear={clearField}
          />

          {/* email */}
          <FormTextInput
            title={"Email"}
            initialValue={profile?.email}
            isDisabled={false}
          />

          {/* date of birth */}
          <Text className="text-[18px] font-pmedium mt-7">Date of birth</Text>
          <View className="h-14 border-b-2 border-b-grayColor flex-1 flex-row justify-between items-center">
            <Text className="font-psemibold text-xl">{data.dob != "" ? formatOnlyDate(data.dob) : ""}</Text>

            <TouchableOpacity onPress={() => setModal(true)} className={`p-3 bg-lightGrayColor2 rounded-lg`}>
              <AntDesign name="calendar" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* country */}
          <FormTextInput
            title={"Country"}
            initialValue={data.country ? data.country : profile?.country}
            placeholder={"Enter your country"}
            validationMsg={"country should be of at least 4 characters"}
            value={(e) => setData({ ...data, country: e })}
            regex={/^.{4,}$/}
            clear={clearField}
          />

          {/* city */}
          <FormTextInput
            title={"City"}
            initialValue={data.city ? data.city : profile?.city}
            placeholder={"Enter your city"}
            validationMsg={"city should be of at least 3 characters"}
            value={(e) => setData({ ...data, city: e })}
            regex={/^.{3,}$/}
            clear={clearField}
          />

          {/* button */}
          <CustomButton
            title={"Update profile info"}
            containerStyles={"w-full h-[50] rounded-md bg-purpleColor mt-7"}
            textStyles={"font-pmedium text-white text-xl"}
            handlePress={updateProfileInfo}
            isloading={loading}
          />

        </View>

      </ScrollView>

      {
        modal &&
        <DateTimePicker
          value={profile?.dob ? new Date(profile?.dob) : new Date()}
          mode="date"
          onChange={(e) => {
            setModal(false)
            setData({ ...data, dob: formatTimestamp(e.nativeEvent.timestamp) })
          }}
          display='calendar'
          className="z-10"
        />
      }
    </View>
  )
}

export default EditProfile