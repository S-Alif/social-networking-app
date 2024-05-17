const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pass: { type: String, required: true },
  profileImg: { type: String },
  profileCiver: { type: String },
  dob: { type: Date },
  isAdmin: { type: Boolean, default: false },
  country: { type: String },
  city: { type: String },
  verified: { type: Boolean, default: false },
  privacy: { type: String, default: "public", enum: ["public", "private", "friends"] },
  status: { type: String, enum: ["active", "deactivated"] }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('users', userSchema)