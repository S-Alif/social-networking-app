const mongoose = require('mongoose');

const reactionSchema = mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
  reactedOn: { type: mongoose.Types.ObjectId, required: true, },
  reaction: {
    type: String,
    enum: ['👍', '😂', '❤️', '😲', '😢', '😡'], 
    required: true
  }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('reactions', reactionSchema)