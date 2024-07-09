const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  notificationFrom: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
  notificationTo: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
  type: { type: String, enum: ["comment", "reaction", "request", "request_accept"] },
  seen: { type: Boolean, default: false },
  postType: { type: String, enum: ["post", "reels", "comment", "request"] },
  postId: { type: mongoose.Types.ObjectId, ref: 'posts', required: false },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('notifications', notificationSchema)