import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import * as DocumentPicker from 'expo-document-picker';
import { FontAwesome6, Entypo } from '@expo/vector-icons';
import { customAlert } from '../scripts/alerts';
import { dataSender, formDataSender } from '../scripts/apiCaller';
import { postUrl } from '../scripts/endpoints';
import CustomButton from './CustomButton';
import { useLocalSearchParams, useNavigation, usePathname } from 'expo-router';
import { fileChecker } from './../scripts/fileChecker';

const CreateUpdatePost = () => {

  const params = useLocalSearchParams()
  const pathname = usePathname()
  const navigation = useNavigation()
  const isUpdateScreen = (pathname == "/pages/updatePost")

  const richText = useRef()
  const [postCaption, setPostCaption] = useState("")
  const [file, setFile] = useState([])
  const [loading, setLoading] = useState(false)

  // if update screen set the post caption
  useEffect(() => {
    if (isUpdateScreen) richText.current?.setContentHTML(params?.caption)
  }, [])

  const submitUpdatedPost = async () => {
    let caption = postCaption.replace(/&nbsp;/g, "").replace(/<[^>]+>/g, "")
    if (caption.trim() == "" || postCaption == "") return customAlert("ERROR !!", "Cannot update")

    let result = await dataSender(postUrl + "/update", { id: params?._id, caption: postCaption })
    if (result != null && result?.status == 1) {
      richText.current?.setContentHTML("")
      setTimeout(() => { navigation.goBack() }, 2000)
    }
  }

  // submit post
  const submitPost = async () => {
    let caption = postCaption.replace(/&nbsp;/g, "").replace(/<[^>]+>/g, "")
    if ((caption.trim() == "" || postCaption == "") && file.length == 0) return customAlert("ERROR !!", "Cannot create empty posts")

    setLoading(true)
    const formData = new FormData()

    if (caption) formData.append("caption", postCaption)
    if (file) file.forEach((file, index) => {
      formData.append(`files[${index}]`, {
        uri: file.uri,
        type: file.mimeType,
        name: file.name,
      })
    })
    formData.append("postType", "normal")

    let post = await formDataSender(postUrl + "/create", formData)
    if (post != null && post?.status == 1) {
      richText.current?.setContentHTML("")
      setPostCaption("")
      setFile([])
    }
    setLoading(false)
  }

  // get files
  const getFiles = async () => {
    let files = await DocumentPicker.getDocumentAsync({
      type: ['image/jpg', 'video/mp4', 'image/png', 'image/jpeg'],
      multiple: true,
    })
    if (files?.canceled) return
    if (files['assets'].length > 3) return customAlert("ERROR !!", "File limit exceded")
    let checker = fileChecker(files['assets'])
    setFile(prev => [...prev, ...checker])
  }

  // handle remove files
  const removeFiles = (uri) => {
    setFile(prev => prev.filter(e => e.uri !== uri))
  }


  return (
    <View className="flex-1 bg-lightGrayColor px-2">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 12 }}>

        <View className="flex-1">
          <Text className="pt-4 text-xl font-psemibold">{isUpdateScreen ? "Update post caption" : "Write post caption"}</Text>
        </View>

        <View className="flex-1 min-h-[400px] bg-lightGrayColor2 mt-3 rounded-t-lg">
          <View className="flex-1 overflow-hidden rounded-t-lg border border-gray-400">
            <RichEditor
              ref={richText}
              className="flex-1"
              placeholder={isUpdateScreen ? "Update post caption..." : "Write post caption..."}
              editorStyle={{
                contentCSSText: 'font-size: 24px;',
              }}
              onChange={setPostCaption}
            />
          </View>

          <RichToolbar
            editor={richText}
            actions={[actions.undo, actions.redo, actions.setBold, actions.setItalic, actions.insertBulletsList, actions.insertOrderedList, actions.blockquote, actions.insertLink, actions.code, actions.indent, actions.fontSize, actions.heading1, actions.heading2, actions.heading3, actions.heading4, actions.heading5, actions.heading6]}
            className="border border-gray-400 border-t-0 rounded-b-lg"
            iconMap={icons}
          />

        </View>

        {/* show picked files */}
        {
          file.length > 0 &&
          <View className="flex-1">
            <Text className="pt-4 text-xl font-psemibold">Picked attachments</Text>
            {
              file.map((e, index) => (
                <View className="flex-1 w-full h-[300px] mt-3 relative rounded-md overflow-hidden" style={{ shadowColor: "rgba(0,0,0,0.2)", elevation: 4 }} key={index} >

                  <TouchableOpacity
                    className="absolute w-[30] h-[30] z-[10] right-[10] top-[15] rounded-md bg-lightGrayColor2 justify-center items-center"
                    onPress={() => removeFiles(e.uri)}
                    disabled={loading}
                  >
                    <Entypo name="cross" size={24} color="black" />
                  </TouchableOpacity>

                  <Image source={{ uri: e.uri }} className="w-full h-full" />
                </View>
              ))
            }
          </View>
        }

        {/* file picker */}
        {
          (!isUpdateScreen && file.length < 3) &&
          <>
            <View className="flex-1 mt-4">
              <Text className="pt-4 text-xl font-psemibold">Choose attachments <Text className="text-gray-400">(maximum of three)</Text> </Text>
            </View>

            {/* for file upload */}
            <View
              className="flex-1 mt-4 h-[100] bg-lightGrayColor2 rounded-lg justify-center items-center border border-gray-400"
              style={{ shadowColor: "rgba(0,0,0,0.3)", elevation: 5 }}
            >
              <CustomButton
                title={<FontAwesome6 name="upload" size={24} color="white" />}
                containerStyles={"rounded-full bg-purpleColor w-[50] max-h-[50] flex-1"}
                handlePress={getFiles}
              />
            </View>
          </>
        }


        {/* post submit button */}
        <View className="mt-4">
          <CustomButton
            title={isUpdateScreen ? "Update post" : "Submit post"}
            containerStyles={"bg-purpleColor min-h-[50]"}
            textStyles={"text-white font-psemibold text-xl"}
            handlePress={isUpdateScreen ? submitUpdatedPost : submitPost}
            isloading={loading}
          />
        </View>

      </ScrollView>
    </View>
  )
}

// text toolbar icons for headings
const icons = {
  [actions.heading1]: ({ tintColor }) => <Text className={`text-2xl text-gray-400 font-psemibold`}>h1</Text>,
  [actions.heading2]: ({ tintColor }) => <Text className={`text-2xl text-gray-400 font-psemibold`}>h2</Text>,
  [actions.heading3]: ({ tintColor }) => <Text className={`text-2xl text-gray-400 font-psemibold`}>h3</Text>,
  [actions.heading4]: ({ tintColor }) => <Text className={`text-2xl text-gray-400 font-psemibold`}>h4</Text>,
  [actions.heading5]: ({ tintColor }) => <Text className={`text-2xl text-gray-400 font-psemibold`}>h5</Text>,
  [actions.heading6]: ({ tintColor }) => <Text className={`text-2xl text-gray-400 font-psemibold`}>h6</Text>,
}

export default CreateUpdatePost