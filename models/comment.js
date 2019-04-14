const mongoose = require('mongoose');

const Comment = mongoose.model('Comment', new mongoose.Schema({
  text: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
}));

module.exports = Comment;