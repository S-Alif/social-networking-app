const mongoose = require('mongoose');

const otpSchema = mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  verified: { type: Boolean, default: 0 },
  createdAt: { type: Date, default: Date.now, index: { expires: '2m' } },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('otps', otpSchema)