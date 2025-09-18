const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide announcement title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide announcement description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify category'],
    enum: ['scheme', 'subsidy', 'loan', 'weather', 'market', 'training', 'technology', 'other']
  },
  targetAudience: {
    type: String,
    enum: ['all', 'owners', 'workers', 'small-farmers', 'large-farmers'],
    default: 'all'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  expiryDate: {
    type: Date
  },
  sourceUrl: {
    type: String
  },
  attachments: [{
    filename: String,
    url: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Announcement', announcementSchema);