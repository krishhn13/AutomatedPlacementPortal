const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  location: { type: String, required: true },
  salary: { type: String },
  jobType: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], 
    required: true 
  },
  companyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Company', 
    required: true 
  },
  companyName: { 
    type: String, 
    required: true 
  },
  applications: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Application' 
  }],
  status: { 
    type: String, 
    enum: ['active', 'closed'], 
    default: 'active' 
  },
  // New fields to match frontend
  minCGPA: { 
    type: Number, 
    default: 7.0 
  },
  eligibleBranches: [{ 
    type: String, 
    default: ["All"] 
  }],
  deadline: { 
    type: Date 
  },
  workMode: { 
    type: String, 
    enum: ['remote', 'onsite', 'hybrid'], 
    default: 'onsite' 
  },
  experienceLevel: { 
    type: String, 
    enum: ['entry', 'mid', 'senior'], 
    default: 'mid' 
  },
  education: { 
    type: String, 
    enum: ['any', 'bachelors', 'masters', 'phd'], 
    default: 'bachelors' 
  },
  skills: [{ 
    type: String 
  }],
  benefits: [{ 
    type: String 
  }],
  department: { 
    type: String, 
    default: 'General' 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Job', jobSchema);