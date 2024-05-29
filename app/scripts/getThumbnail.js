import * as VideoThumbnails from 'expo-video-thumbnails'
import { customAlert } from './alerts';

export const generateThumbnail = async (link) => {
  try {
    const { uri } = await VideoThumbnails.getThumbnailAsync(
      link,
      {
        time: 2000,
      }
    )
    return uri
  } catch (e) {
    customAlert("ERROR !!", e.message)
  }
};