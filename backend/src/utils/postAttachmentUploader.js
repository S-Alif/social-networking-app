// upload files to cloudinary

const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.imageCloudName,
  api_key: process.env.imageUploadApi,
  api_secret: process.env.imageCloudSecret
});

// delete the files
exports.deleteFiles = async (urlArray) => {
  const deleteFiles = urlArray.map(url => {
    const publicId = url.split('/').pop().split('.')[0]
    return cloudinary.uploader.destroy(publicId)
  })
  await Promise.all(deleteFiles)
}

// upload attachments
exports.attachmentUploader = async (file) => {
  try {
    let result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ resource_type: file.mimetype.startsWith('video') ? 'video' : 'image', transformation: { quality: 'auto:low' } }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
      stream.write(file.data);
      stream.end();
    })

    return result.url
  } catch (error) {
    return null
  }
}