import { customAlert } from "./alerts"

const videoSizeLimit = 7 * 1024 * 1024
const imageSizeLimit = 4 * 1024 * 1024
const allowedFileType = ['image/png', 'image/jpg', 'image/jpeg', 'video/mp4']

export const fileChecker = (files) => {
  if (!files) return []
  let notAllowedType = 0
  let overSize = 0
  let checkFileArray = []

  files.map((e) => {
    if (allowedFileType.includes(e.mimeType)) {

      if (e.mimeType == 'video/mp4') {
        if (e.size > videoSizeLimit || e.fileSize > videoSizeLimit) return overSize++
        checkFileArray.push(e)
      }
      else {
        if (e.size > imageSizeLimit) return overSize++
        checkFileArray.push(e)
      }

    }
    else {
      notAllowedType++
    }
  })

  if (notAllowedType > 0) customAlert("ERROR !!", `Files not allowed : ${notAllowedType}`)
  if (overSize > 0) customAlert("ERROR !!", `Files over size limit : ${overSize}`)

  return checkFileArray
}