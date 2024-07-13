const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'First name is required'] },
  lastName: { type: String, required: [true, 'Last name is required'] },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+@.+\..+/, 'Please enter a valid email address']
  },
  pass: { type: String, required: [true, 'Password is required'] },
  profileImg: { type: String },
  profileCover: { type: String },
  dob: { type: Date },
  isAdmin: { type: Boolean, default: false },
  country: { type: String },
  city: { type: String },
  verified: { type: Boolean, default: false },
  friendsCount: { type: Number, default: 0, min: 0 },
  postCount: { type: Number, default: 0, min: 0 },
  privacy: {
    type: String,
    default: "public",
    enum: {
      values: ["public", "private", "friends"],
      message: 'Privacy must either be public, private or friends'
    }
  },
  status: {
    type: String,
    default: "active",
    enum: {
      values: ["active", "deactivated"],
      message: 'Status must either be active or deactivated'
    }
  }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('users', userSchema);
