const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: true,
    },
  },
  {
    timestamps: true
  }
  );
  
  module.exports = mongoose.model('Reply', replySchema);