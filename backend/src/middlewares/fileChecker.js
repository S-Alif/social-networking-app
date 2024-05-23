const { responseMsg } = require("../utils/helpers")

const videoSizeLimit = 7 * 1024 * 1024
const imageSizeLimit = 4 * 1024 * 1024

const allowedMimeArray = ['image/png', 'image/jpg', 'image/jpeg', 'video/mp4']

module.exports = async (req, res, next) => {
  const files = req.files
  let fileOverLimit = 0
  let fileTypeNotMatch = false

  if(!files) return next()

  // check for file types and size
  Object.keys(files).forEach(key => {
    const fileArray = Array.isArray(files[key]) ? files[key] : [files[key]];

    fileArray.forEach(file => {
      if (!allowedMimeArray.includes(file.mimetype)) {
        fileTypeNotMatch = true;
      } else {
        if (file.mimetype === "video/mp4") {
          if (file.size > videoSizeLimit) fileOverLimit++;
        } else {
          if (file.size > imageSizeLimit) fileOverLimit++;
        }
      }
    });
  });

  if (fileTypeNotMatch) return res.status(200).json(responseMsg(0, 200, "unknown file type"));
  if(fileOverLimit > 0) return res.status(200).json(responseMsg(0, 200, "File over size limit : "+fileOverLimit))
  next()
}