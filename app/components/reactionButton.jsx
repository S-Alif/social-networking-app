import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import Reactions from './reactions'
import { SimpleLineIcons } from '@expo/vector-icons'
import { reactionSender } from '../scripts/apiCaller'
import { reactionUrl } from '../scripts/endpoints'


const ReactionButton = ({ postId, reaction }) => {
  const [showReactions, setShowReactions] = useState(false)
  const [selectedReaction, setSelectedReaction] = useState(null)
  const [reactionData, setReactionData] = useState(null)

  useEffect(() => {
    if (reaction) {
      setSelectedReaction(reaction?.reaction)
      setReactionData(reaction)
    }
  }, [])

  const handleLongPress = () => {
    setShowReactions(true)
  }

  const handleSelectReaction = async (reactionSelected) => {

    if (selectedReaction == null) {
      let addReaction = await reactionSender(reactionUrl, { reactedOn: postId, reaction: reactionSelected })
      if (addReaction?.status == 0) return
      setReactionData(addReaction.data)
      setSelectedReaction(reactionSelected)
      return setShowReactions(false)
    }

    if (selectedReaction !== null && reactionSelected === selectedReaction) {
      let removeReaction = await reactionSender(reactionUrl + `/delete/${postId}/${reactionData?._id}`, { reactedOn: postId, reaction: reactionSelected })
      if (removeReaction?.status == 0) return
      setSelectedReaction(null)
      return setShowReactions(false)
    }

    if (selectedReaction !== null && reactionSelected !== selectedReaction) {
      let updateReaction = await reactionSender(reactionUrl + `/update`, { reactedOn: postId, reaction: reactionSelected })
      if (updateReaction?.status == 0) return
      setReactionData(updateReaction.data)
      setSelectedReaction(reactionSelected)
      return setShowReactions(false)
    }
  }

  return (
    <View className="relative items-center">
      <TouchableOpacity
        onLongPress={handleLongPress}
        onPressOut={() => {
          setTimeout(() => {
            setShowReactions(false)
          }, 5000)
        }}
      >
        <View className="flex-1 justify-center items-center flex-row">
          {selectedReaction ?
            <Text className="text-3xl">{selectedReaction}</Text> :
            <>
              <SimpleLineIcons name="like" size={20} color="black" />
              <Text className="text-lg pl-1"> like</Text>
            </>
          }
        </View>
      </TouchableOpacity>
      {showReactions && (
        <Reactions onSelectReaction={handleSelectReaction} />
      )}
    </View>
  )
}

export default ReactionButton