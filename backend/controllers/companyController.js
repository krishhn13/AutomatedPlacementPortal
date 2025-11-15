const companyModel = require("../models/Company")
const jobModel = require("../models/Job") // You'll need to create this
const applicationModel = require("../models/Application") // You'll need to create this
const studentModel = require("../models/Student")

// Existing methods
const getAll = async (req, res) => {
    try {
        return res.status(200).json({"data": await companyModel.find()});
    } catch(err) {
        res.status(500).json({message:err.message})
    }
}

const addCompany = async(req, res) => {
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

const updateCompany = async (req, res) => {
    try {
        const { name } = req.params;
        const company = await companyModel.findOne({ name });
        if (!company) {
            return res.status(404).json({ message: "COMPANY NOT FOUND" });
        }

        if (req.body.name && req.body.name !== name) {
            const conflict = await companyModel.findOne({ name: req.body.name });
            if (conflict) return res.status(409).json({ message: "Company already exists" });
        }

        Object.assign(company, req.body);
        const updated = await company.save();
        return res.status(200).json({ data: updated });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

const deleteCompany = async(req, res) => {
    try{
        const {name} = req.params;
        const isThere = await companyModel.findOne({name})
        if(!isThere) return res.status(404).json({
            message : "COMPANY NOT FOUND"
        })
        await companyModel.deleteOne({name});
        return res.status(200).json({message:"Company removed successfully"})
    } catch(err) {
        return res.status(500).json({message:err.message})
    }
}

// NEW METHODS FOR APPLICANT MANAGEMENT

// Get all applicants for company's jobs
const getApplicants = async (req, res) => {
    try {
        const companyId = req.user._id; // From auth middleware
        
        // First, check if Job model exists to avoid errors
        let companyJobs = [];
        try {
            companyJobs = await jobModel.find({ companyId: companyId });
        } catch (jobError) {
            console.log("Job model not available yet:", jobError.message);
            // Return empty array if Job model doesn't exist
            return res.status(200).json({ applicants: [] });
        }
        
        const jobIds = companyJobs.map(job => job._id);
        
        // If no jobs, return empty array
        if (jobIds.length === 0) {
            return res.status(200).json({ applicants: [] });
        }
        
        // Try to find applications
        let applications = [];
        try {
            applications = await applicationModel.find({ jobId: { $in: jobIds } })
                .populate('studentId')
                .populate('jobId');
        } catch (appError) {
            console.log("Application model not available yet:", appError.message);
            return res.status(200).json({ applicants: [] });
        }
        
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
        // Return empty array instead of error for better frontend experience
        return res.status(200).json({ applicants: [] });
    }
}

// Get company's jobs
const getCompanyJobs = async (req, res) => {
    try {
        const companyId = req.user._id; // From auth middleware
        
        let jobs = [];
        try {
            jobs = await jobModel.find({ companyId: companyId });
        } catch (error) {
            console.log("Job model not available yet:", error.message);
        }
        
        return res.status(200).json({ jobs: jobs });
    } catch (err) {
        console.error("Error fetching company jobs:", err);
        return res.status(200).json({ jobs: [] });
    }
}

// Update application status
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status, jobId } = req.body;
        const companyId = req.user._id;
        
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
    updateCompany, // This was missing - causing the error
    deleteCompany,
    getApplicants,
    getCompanyJobs,
    updateApplicationStatus
}