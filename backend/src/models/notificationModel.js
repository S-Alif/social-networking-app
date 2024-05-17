const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
  message: { type: String, required: true },
  notificationFrom: { type: String, required: true },
  verified: { type: Boolean, default: 0 },
  expired: { type: Boolean, default: 0 }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('notifications', notificationSchema)