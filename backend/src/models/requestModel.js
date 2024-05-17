const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
  from: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
  to: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
  accepted: { type: Boolean, default: 0 }
}, { timestamps: true, versionKey: false });

module.exports = mongoose.model('requests', requestSchema)