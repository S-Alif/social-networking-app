const mongoose = require('mongoose');

const attachmentSchema = mongoose.Schema({
  postId: { type: mongoose.Types.ObjectId, required: true, ref: "posts" },
  fileLocation: { type: String, required: true },
  fileType: { type: String, enum: ["image", "video"] },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('postAttachments', attachmentSchema)