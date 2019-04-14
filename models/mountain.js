const mongoose = require('mongoose');

const mountainSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ] // the comments should be an array of comment Ids.
});

const Mountain = mongoose.model('Mountain', mountainSchema);


module.exports = Mountain;