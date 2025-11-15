const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  website: { type: String, default: '' },
  location: { type: String, required: true },
  industry: { type: String, required: true },
  description: { type: String, default: '' },
  employeeCount: { type: String, default: '' },
  jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }]
}, { 
  timestamps: true 
});

// Remove any custom index that might be causing the duplicate key error
// companySchema.index({ id: 1 }, { unique: true }); // REMOVE THIS LINE if it exists

module.exports = mongoose.model('Company', companySchema);