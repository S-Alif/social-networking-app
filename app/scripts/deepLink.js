import { Share } from 'react-native'

export const shareItem = async (title, msg, shareLink) => {
  await Share.share({
    message: `${msg} : ${shareLink}`,
    title: title,
  })
}

export const generateShareLink = (whereTo, postId) => {
  let scheme = 'ConnectVibe'
  let url = `${scheme}://${whereTo}/${postId}`
  return url
}