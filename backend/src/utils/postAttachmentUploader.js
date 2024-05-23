// upload files to cloudinary

const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.imageCloudName,
  api_key: process.env.imageUploadApi,
  api_secret: process.env.imageCloudSecret
});

// public id finder
exports.extractPublicId = (imageUrl) => {
  const parts = imageUrl.split('/');
  const fileName = parts.pop();
  const publicId = fileName.split('.')[0];
  return publicId;
}

// upload image
exports.imageUploader = async (file) => {
  try {
    let result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ transformation: { quality: 'auto:low' } }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
      stream.write(file);
      stream.end();
    });

    return result.url
  } catch (error) {
    return null
  }
}