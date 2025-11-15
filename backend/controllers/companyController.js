const companyModel = require("../models/Company")
const jobModel = require("../models/Job") 
const applicationModel = require("../models/Application") 
const studentModel = require("../models/Student") 
const getAll = async (req,res) => {
        try {
                return res.status(200).json({"data": await companyModel.find()});
        } catch(err) {
                res.status(500).json({message:err.message})
        }
}

const addCompany = async(req,res) => {
        try{
                const { name } = req.body;
                if (!name) return res.status(400).json({ message: "Name is required" });

                const existing = await companyModel.findOne({ name });
                if (existing) return res.status(409).json({ message: "Company already exists" });

                const company = new companyModel(req.body);
                const saved = await company.save();
                return res.status(201).json({ data: saved });
        } catch(err) {
                res.status(500).json({message:err.message})
        }
}
const getByName = async (req, res) => {
        try {
                const { name } = req.params;
                const isThere = await companyModel.findOne({ name });
                if (!isThere) return res.status(404).json({ message: "COMPANY NOT FOUND" });
                return res.status(200).json({ data: isThere });
        } catch (err) {
                res.status(500).json({message : err.message});
        } 
}
// Get all applicants for company's jobs
const getApplicants = async (req, res) => {
  try {
    const companyId = req.user.userId; // From auth middleware
    
    // Find all jobs by this company
    const companyJobs = await jobModel.find({ companyId: companyId });
    const jobIds = companyJobs.map(job => job._id);
    
    // Find all applications for these jobs and populate student details
    const applications = await applicationModel.find({ jobId: { $in: jobIds } })
      .populate('studentId')
      .populate('jobId');
    
    // Format the response
    const formattedApplicants = applications.map(app => {
      const student = app.studentId;
      const job = app.jobId;
      
      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        location: student.location,
        education: student.education,
        branch: student.branch,
        cgpa: student.cgpa,
        rollNo: student.rollNo,
        skills: student.skills || [],
        resume: student.resume,
        avatar: student.avatar,
        appliedJobs: [{
          jobId: job._id,
          jobTitle: job.title,
          companyId: job.companyId,
          companyName: job.companyName,
          appliedDate: app.appliedDate,
          status: app.status,
          resume: app.resume
        }]
      };
    });
    
    return res.status(200).json({ applicants: formattedApplicants });
  } catch (err) {
    console.error("Error fetching applicants:", err);
    return res.status(500).json({ message: "Error fetching applicants" });
  }
}

// Get company's jobs
const getCompanyJobs = async (req, res) => {
  try {
    const companyId = req.user.userId; // From auth middleware
    const jobs = await jobModel.find({ companyId: companyId });
    
    return res.status(200).json({ jobs: jobs });
  } catch (err) {
    console.error("Error fetching company jobs:", err);
    return res.status(500).json({ message: "Error fetching company jobs" });
  }
}

// Update application status
const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, jobId } = req.body;
    const companyId = req.user.userId;
    
    // Verify the job belongs to the company
    const job = await jobModel.findOne({ _id: jobId, companyId: companyId });
    if (!job) {
      return res.status(404).json({ message: "Job not found or access denied" });
    }
    
    // Update the application status
    const application = await applicationModel.findOneAndUpdate(
      { _id: applicationId, jobId: jobId },
      { status: status },
      { new: true }
    );
    
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    
    return res.status(200).json({ 
      message: "Application status updated successfully", 
      application: application 
    });
  } catch (err) {
    console.error("Error updating application status:", err);
    return res.status(500).json({ message: "Error updating application status" });
  }
}

module.exports = {
  getAll,
  getByName,
  addCompany,
  updateCompany,
  deleteCompany,
  getApplicants,
  getCompanyJobs,
  updateApplicationStatus
}