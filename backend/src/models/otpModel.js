const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  verified: { type: Boolean, default: 0 },
  expired: { type: Boolean, default: 0 }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('otps', otpSchema)