const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    feedbackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Feedback',
      required: true,
    },
  },
  {
    timestamps: true
  }
  );
  
  module.exports = mongoose.model('Comment', commentSchema);