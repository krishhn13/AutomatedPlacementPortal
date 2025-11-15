const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', 
    required: true 
  },
  jobId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job', 
    required: true 
  },
  appliedDate: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['applied', 'shortlisted', 'interview', 'selected', 'rejected'],
    default: 'applied'
  },
  resume: { 
    filename: String,
    url: String,
    uploadedAt: Date,
    size: Number
  },
  coverLetter: { type: String },
  notes: { type: String }
}, { 
  timestamps: true 
});

// Ensure one application per student per job
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);