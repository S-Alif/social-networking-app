import { View, Text, ScrollView, Dimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import CustomButton from './../../components/CustomButton';
import RenderHTML from 'react-native-render-html';
import { formDataSender } from '../../scripts/apiCaller';
import { postUrl } from '../../scripts/endpoints';

const Create = () => {

  const richText = useRef();
  const [postCaption, setPostCaption] = useState("")

  // submit post
  const submitPost = async () => {
    let caption = await richText.current?.getContentHtml()
    if (caption == "" || caption == null) return

    const formData = new FormData()

    formData.append('caption', caption)
    formData.append('postType', "normal")

    let post = await formDataSender(postUrl + "/create", formData)

  }



  return (
    <View className="flex-1 bg-lightGrayColor px-2">
      <ScrollView className="flex-1">

        <View className="flex-1">
          <Text className="pt-4 text-xl font-psemibold">Write post caption</Text>
        </View>

        <View className="flex-1 min-h-[400px] p-3 bg-lightGrayColor2 mt-3 rounded-lg border border-gray-300">
          <RichEditor
            ref={richText}
            className="flex-1 border border-gray-300"
            placeholder="Write your post caption ...."
            containerStyle={{ fontSize: 24, lineHeight: 32 }}
          />
          <RichToolbar
            editor={richText}
            actions={[actions.undo, actions.redo, actions.setBold, actions.setItalic, actions.insertBulletsList, actions.insertOrderedList, actions.blockquote, actions.insertLink, actions.code, actions.indent, actions.fontSize, actions.heading1, actions.heading2, actions.heading3, actions.heading4, actions.heading5, actions.heading6]}
            className="border border-gray-300 border-t-0"
            iconMap={icons}
          />

        </View>


        {/* post submit button */}
        <View className="mt-4">
          <CustomButton
            title={"Submit post"}
            containerStyles={"rounded-lg bg-purpleColor min-h-[50]"}
            textStyles={"text-white font-psemibold text-xl"}
            handlePress={submitPost}
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