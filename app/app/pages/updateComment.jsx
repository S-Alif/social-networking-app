import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router'
import FormTextInput from '../../components/textInput'
import CustomButton from '../../components/CustomButton'
import { dataSender } from '../../scripts/apiCaller'
import { commentUrl } from '../../scripts/endpoints'

const UpdateComment = () => {

  const params = useLocalSearchParams()
  const navigation = useNavigation()

  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  // update comment
  const updateComment = async () => {
    if(comment == "" || comment == params?.comment) return

    let update = await dataSender(commentUrl + "/update", {id: params?._id, commentOn: params?.commentOn, comment: comment})
    if(update == null || update?.status == 0) return
    navigation.goBack()
  }

  return (
    <View className="flex-1 bg-lightGrayColor2 px-4">
      <View className="pt-3">
        <FormTextInput
          // title={"Update your comment"}
          containerStyle={"py-0"}
          placeholder={"update you comment"}
          validationMsg={"comment should be at least 2 characters"}
          value={setComment}
          regex={/^.{2,}$/}
          initialValue={params?.comment}
        />
        <CustomButton
          title={"update comment"}
          handlePress={updateComment}
          isloading={loading}
          containerStyles={"bg-purpleColor min-h-[50] my-10"}
          textStyles={"text-lightGrayColor2 text-xl font-pmedium"}
        />
      </View>
    </View>
  )
}

export default UpdateComment