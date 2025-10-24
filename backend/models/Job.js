const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  salary: String,
  type: String, // e.g., "Internship", "Full-time"
  postedAt: { type: Date, default: Date.now },
  deadline: Date,
  description: String,
  requirements: [String],
  logo: String,
  minCGPA: Number,
  allowedBranches: [String],
});

module.exports = mongoose.model('Job', jobSchema);
