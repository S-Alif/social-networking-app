const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
  commentOn: { type: mongoose.Types.ObjectId, required: true },
  comment: { type: String, required: true },
  edited: { type: Boolean, default: 0 }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('comments', commentSchema)