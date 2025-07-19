// models/Vote.js

const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true  // Ensures one vote per user
  },
  party: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Vote', voteSchema);
