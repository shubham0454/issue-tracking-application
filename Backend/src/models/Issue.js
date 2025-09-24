const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  assignee: {
    type: String,
    trim: true,
    maxlength: 100
  },
  reporter: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 50
  }]
}, {
  timestamps: true // Creates createdAt and updatedAt automatically
});

// Add text search index
issueSchema.index({ 
  title: 'text', 
  description: 'text' 
});

module.exports = mongoose.model('Issue', issueSchema);