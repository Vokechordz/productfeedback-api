const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'  
  },
  likes: { 
    type: Number, 
    default: 0 
},
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
  }
},
{
    timestamps: true
}
);

module.exports = mongoose.model('Feedback', feedbackSchema);