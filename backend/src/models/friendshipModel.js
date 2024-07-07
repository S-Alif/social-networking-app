const mongoose = require('mongoose');

const friendshipSchema = mongoose.Schema({
  user1: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
  user2: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('friendships', friendshipSchema)