import { View, Text, ScrollView } from 'react-native'
import React, { useRef, useState } from 'react'
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import CustomButton from './../../components/CustomButton';
import { formDataSender } from '../../scripts/apiCaller';
import { postUrl } from '../../scripts/endpoints';
import * as DocumentPicker from 'expo-document-picker';
import { FontAwesome6 } from '@expo/vector-icons';
import { customAlert } from '../../scripts/alerts';

const Create = () => {

  const richText = useRef();
  const [postCaption, setPostCaption] = useState("")
  const [file, setFile] = useState([])
  const [loading, setLoading] = useState(false)

  // submit post
  const submitPost = async () => {
    setLoading(true)
    let caption = postCaption.replace(/&nbsp;/g, "").replace(/<[^>]+>/g, '');
    if ((!caption || postCaption == "") && file.length == 0) return customAlert("ERROR !!", "Cannot create empty posts")

    const formData = new FormData()

    if (caption) formData.append('caption', postCaption)
    if (file) file.forEach((file, index) => {
      formData.append(`files[${index}]`, {
        uri: file.uri,
        type: file.mimeType,
        name: file.name,
      });
    });
    formData.append('postType', "normal")

    let post = await formDataSender(postUrl + "/create", formData)
    setLoading(false)
  }

  // get files
  const getFiles = async () => {
    let files = await DocumentPicker.getDocumentAsync({
      type: ['image/jpg', 'video/mp4', 'image/png', 'image/jpeg'],
      multiple: true,
    })

    if (files == null) return
    if (files['assets'].length > 3) return customAlert("ERROR !!", "File limit exceded")

    setFile(files['assets'])
  }



  return (
    <View className="flex-1 bg-lightGrayColor px-2">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 12 }}>

        <View className="flex-1">
          <Text className="pt-4 text-xl font-psemibold">Write post caption</Text>
        </View>

        <View className="flex-1 min-h-[400px] p-3 bg-lightGrayColor2 mt-3 rounded-lg border border-gray-300">
          <RichEditor
            ref={richText}
            className="flex-1 border border-gray-300"
            placeholder="Write your post caption ...."
            editorStyle={{
              contentCSSText: 'font-size: 24px;',
            }}
            onChange={setPostCaption}
          />

          <RichToolbar
            editor={richText}
            actions={[actions.undo, actions.redo, actions.setBold, actions.setItalic, actions.insertBulletsList, actions.insertOrderedList, actions.blockquote, actions.insertLink, actions.code, actions.indent, actions.fontSize, actions.heading1, actions.heading2, actions.heading3, actions.heading4, actions.heading5, actions.heading6]}
            className="border border-gray-300 border-t-0"
            iconMap={icons}
          />

        </View>

        {/* show picked files */}

        {/* file picker */}
        {
          file.length < 3 &&
          <>
            <View className="flex-1 mt-4">
              <Text className="pt-4 text-xl font-psemibold">Choose file <Text className="text-gray-400">(maximum of three files)</Text> </Text>
            </View>

            {/* for file upload */}
            <View
              className="flex-1 mt-4 h-[100] bg-lightGrayColor2 rounded-lg justify-center items-center"
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
            title={"Submit post"}
            containerStyles={"bg-purpleColor min-h-[50]"}
            textStyles={"text-white font-psemibold text-xl"}
            handlePress={submitPost}
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

export default Create