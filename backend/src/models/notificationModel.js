const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  message: { type: String, required: true },
  notificationFrom: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
  notificationTo: { type: mongoose.Types.ObjectId, required: true, ref: 'users' },
  type: { type: String, enum: ["post", "comment", "reaction", "request", "request_accept"] },
  seen: { type: Boolean, default: false },
  postId: { type: mongoose.Types.ObjectId, ref: 'posts', required: false },
  commentId: { type: mongoose.Types.ObjectId, ref: 'comments', required: false },
  requestId: { type: mongoose.Types.ObjectId, ref: 'requests', required: false }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('notifications', notificationSchema)