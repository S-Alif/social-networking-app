const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
  caption: { type: String },
  reactionCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 },
  postType: { type: String, default: "normal", enum: ["normal", "reels"], required: true }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('posts', postSchema)