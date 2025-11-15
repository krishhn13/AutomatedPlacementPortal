const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  location: { type: String, required: true },
  salary: { type: String },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Internship'], required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  companyName: { type: String, required: true },
  applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  status: { type: String, enum: ['active', 'closed'], default: 'active' }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Job', jobSchema);