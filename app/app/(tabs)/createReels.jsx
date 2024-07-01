import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { Entypo, FontAwesome6 } from '@expo/vector-icons'
import { fileChecker } from '../../scripts/fileChecker'
import { ResizeMode, Video } from 'expo-av'
import { customAlert } from '../../scripts/alerts'
import * as ImagePicker from 'expo-image-picker';
import { postUrl } from '../../scripts/endpoints'
import { formDataSender } from '../../scripts/apiCaller'

const CreateReels = () => {

  const [caption, setCaption] = useState("")
  const [videoFile, setVideoFile] = useState(null)
  const [loading, setLoading] = useState(false)

  // get files
  const getFiles = async () => {
    let files = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
      allowsMultipleSelection: false,
      selectionLimit: 1
    })
    if (files?.canceled) return
    if (files['assets'].length > 1) return customAlert("ERROR !!", "File limit exceded")
    let checker = fileChecker(files['assets'])
    if (checker.length < 1) return

    const { width, height, duration } = checker[0]
    const isPortrait = width < height
    const isDurationValid = duration < 45000

    if (isPortrait && isDurationValid) {
      setVideoFile(checker[0])
    } else {
      customAlert("ERROR !!", "Please select a portrait video that is less than 45 seconds long")
    }
  }

  // submit post
  const submitPost = async () => {
    setLoading(true)
    if (videoFile == null) return customAlert("ERROR !!", "Cannot create threels without video")
    if (caption.trim().length > 100) return customAlert("Threels caption should be less than 100 characters")

    const formData = new FormData()

    if (caption) formData.append('caption', caption)
    formData.append('file', {
      uri: videoFile.uri,
      type: videoFile.mimeType,
      name: videoFile.fileName,
    })
    formData.append('postType', "reels")

    let post = await formDataSender(postUrl + "/create", formData)
    setLoading(false)
  }

  // handle remove files
  const removeFiles = (uri) => {
    setVideoFile(null)
  }


  return (
    <View className="flex-1 bg-lightGrayColor px-2">
      <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>

        {/* caption */}
        <Text className="pt-4 text-xl font-psemibold">Write threel caption <Text className="text-gray-400">(100 characters max)</Text></Text>
        <TextInput
          value={caption}
          onChangeText={setCaption}
          placeholder='threel caption'
          className="mt-3 border border-gray-400 rounded-md px-2 h-[60] bg-lightGrayColor2 font-pmedium text-xl"
        />

        {/* video */}
        {
          videoFile == null &&
          <View className="mt-4">
            <Text className="pt-4 text-xl font-psemibold">Choose threel</Text>

            {/* for file upload */}
            <View
              className="mt-4 h-[100] bg-lightGrayColor2 rounded-lg justify-center items-center border border-gray-400"
              style={{ shadowColor: "rgba(0,0,0,0.3)", elevation: 5 }}
            >
              <CustomButton
                title={<FontAwesome6 name="upload" size={24} color="white" />}
                containerStyles={"rounded-full bg-purpleColor w-[50] max-h-[50] flex-1"}
                handlePress={getFiles}
              />
            </View>
          </View>
        }

        {/* show selected video file */}
        {
          videoFile != null &&
          <View className="flex-1 aspect-auto mt-3 relative rounded-md overflow-hidden" style={{ shadowColor: "rgba(0,0,0,0.3)", elevation: 4, minHeight: 700 }}>

            <TouchableOpacity
              className="absolute w-[30] h-[30] z-[10] right-[10] top-[15] rounded-md bg-lightGrayColor2 justify-center items-center"
              onPress={() => removeFiles()}
            >
              <Entypo name="cross" size={24} color="black" />
            </TouchableOpacity>

            <Video
              source={{ uri: videoFile?.uri }}
              style={{ maxWidth: "100%", height: "100%" }}
              resizeMode={ResizeMode.COVER}
              useNativeControls
              shouldPlay
              isLooping
            />
          </View>
        }


        {/* post submit button */}
        {
          videoFile != null &&
          <View className="mt-4">
            <CustomButton
              title={"Submit post"}
              containerStyles={"bg-purpleColor min-h-[50]"}
              textStyles={"text-white font-psemibold text-xl"}
              handlePress={submitPost}
              isloading={loading}
            />
          </View>
        }


      </ScrollView>
    </View>
  )
}

export default CreateReels