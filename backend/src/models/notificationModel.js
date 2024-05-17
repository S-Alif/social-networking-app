const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  message: { type: String, required: true },
  notificationFrom: { type: mongoose.Types.ObjectId, required: true },
  notificationTo: { type: mongoose.Types.ObjectId, default: true },
  type: { type: String, enum: ["post", "request"] },
  seen: { type: Boolean, default: 0 }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('notifications', notificationSchema)