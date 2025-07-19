const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  voted: { type: Boolean, default: false } // renamed from hasVoted
});

module.exports = mongoose.model('User', userSchema);
