import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import authStore from './../../constants/authStore';
import { dataFetcher, formDataSender } from '../../scripts/apiCaller';
import { userUrl } from '../../scripts/endpoints';
import * as ImagePicker from 'expo-image-picker';
import { fileChecker } from '../../scripts/fileChecker';
import CustomButton from '../../components/CustomButton';
import { FontAwesome6, Entypo, AntDesign } from '@expo/vector-icons';

const EditProfile = () => {

  const { profile, setProfile } = authStore()

  const [newCover, setNewCover] = useState(null)
  const [newProfileImg, setNewProfileImg] = useState(null)
  const [loading, setLoading] = useState(false)

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




  return (
    <View className="flex-1 bg-lightGrayColor">
      <ScrollView>

        <View className="flex-1 w-full h-[250] px-2 pt-2 relative overflow-visible">
          {/* profile cover */}
          <View className="absolute right-2 top-5 z-10 w-[50]">

            <CustomButton
              title={<FontAwesome6 name="pencil" size={24} color="#3D4754" />}
              containerStyles={"w-[40] h-[40] mb-2 rounded-md bg-lightGrayColor2"}
              handlePress={() => getImageFile("cover")}
            />

            {
              newCover !== null &&
              <>
                <CustomButton
                  title={<Entypo name="cross" size={30} color="#3D4754" />}
                  containerStyles={"w-[40] h-[40] mb-2 rounded-md bg-lightGrayColor2"}
                  handlePress={() => removeSelectedImage("cover")}
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
              />

              {
                newProfileImg !== null &&
                <>
                  <CustomButton
                    title={<Entypo name="cross" size={30} color="white" />}
                    containerStyles={"w-[40] h-[40] rounded-md bg-purpleColor ml-2"}
                    handlePress={() => removeSelectedImage("profile")}
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
        <View className="px-2 pt-[170]">

        </View>


      </ScrollView>
    </View>
  )
}

export default EditProfile