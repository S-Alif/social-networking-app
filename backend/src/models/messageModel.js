const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  from: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
  to: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
  message: { type: String, required: true },
  edited: { type: Boolean, default: false },
  seen: { type: Boolean, default: false },
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('messages', messageSchema)