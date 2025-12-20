const companyModel = require("../models/Company");
const jobModel = require("../models/Job");
const applicationModel = require("../models/Application");
const studentModel = require("../models/Student");

// Get all companies
const getAll = async (req, res) => {
    try {
        return res.status(200).json({"data": await companyModel.find()});
    } catch(err) {
        res.status(500).json({message:err.message});
    }
}

// Add company
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
        res.status(500).json({message:err.message});
    }
}

// Get company by name
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

// Update company
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

// Delete company
const deleteCompany = async(req, res) => {
    try{
        const {name} = req.params;
        const isThere = await companyModel.findOne({name});
        if(!isThere) return res.status(404).json({
            message : "COMPANY NOT FOUND"
        });
        await companyModel.deleteOne({name});
        return res.status(200).json({message:"Company removed successfully"});
    } catch(err) {
        return res.status(500).json({message:err.message});
    }
}

// Get company profile for dashboard
const getCompanyProfile = async (req, res) => {
    try {
        const company = req.user;
        
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const companyData = {
            _id: company._id,
            name: company.name,
            email: company.email,
            phone: company.phone,
            website: company.website,
            location: company.location,
            industry: company.industry,
            description: company.description,
            employeeCount: company.employeeCount,
            jobs: company.jobs || [],
            createdAt: company.createdAt,
            updatedAt: company.updatedAt
        };

        return res.status(200).json({ data: companyData });
    } catch (err) {
        console.error("Error fetching company profile:", err);
        return res.status(500).json({ message: err.message });
    }
}

// Get dashboard stats
const getDashboardStats = async (req, res) => {
    try {
        const companyId = req.user._id;
        
        console.log("Fetching stats for company:", companyId);

        let totalJobs = 0;
        let activeJobs = 0;
        
        try {
            totalJobs = await jobModel.countDocuments({ companyId: companyId });
            activeJobs = await jobModel.countDocuments({ 
                companyId: companyId, 
                status: 'active' 
            });
            
            console.log("Job stats - Total:", totalJobs, "Active:", activeJobs);
        } catch (jobError) {
            console.error("Job stats error:", jobError.message);
        }

        let totalApplications = 0;
        let pendingApplications = 0;
        let hiredCount = 0;
        
        try {
            const companyJobs = await jobModel.find({ companyId: companyId });
            const jobIds = companyJobs.map(job => job._id);
            
            console.log("Found job IDs for applications:", jobIds.length);
            
            if (jobIds.length > 0) {
                totalApplications = await applicationModel.countDocuments({ 
                    jobId: { $in: jobIds } 
                });
                pendingApplications = await applicationModel.countDocuments({ 
                    jobId: { $in: jobIds },
                    status: 'pending' 
                });
                hiredCount = await applicationModel.countDocuments({ 
                    jobId: { $in: jobIds },
                    status: 'accepted' 
                });
                
                console.log("Application stats - Total:", totalApplications, "Pending:", pendingApplications, "Hired:", hiredCount);
            }
        } catch (appError) {
            console.error("Application stats error:", appError.message);
        }

        const stats = {
            totalJobs,
            activeJobs,
            totalApplications,
            pendingApplications,
            hiredCount
        };
        
        console.log("Final stats object:", stats);
        
        res.json({
            success: true,
            stats: stats
        });
    } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        res.status(500).json({ 
            success: false,
            message: "Error fetching dashboard stats",
            stats: {
                totalJobs: 0,
                activeJobs: 0,
                totalApplications: 0,
                pendingApplications: 0,
                hiredCount: 0
            }
        });
    }
}

// Get company's jobs - FIXED VERSION
const getCompanyJobs = async (req, res) => {
    try {
        console.log("getCompanyJobs called");
        console.log("req.user:", req.user);
        console.log("req.user._id:", req.user._id);
        console.log("req.role:", req.role);
        
        if (!req.user || !req.user._id) {
            console.log("ERROR: req.user or req.user._id is undefined");
            return res.status(404).json({ 
                success: false,
                message: "COMPANY NOT FOUND - User not authenticated properly",
                debug: { user: req.user, role: req.role }
            });
        }
        
        const companyId = req.user._id;
        
        console.log("Fetching jobs for company ID:", companyId);
        console.log("Company name:", req.user.name);
        
        // First verify company exists
        const companyExists = await companyModel.findById(companyId);
        if (!companyExists) {
            console.log("ERROR: Company not found in database:", companyId);
            return res.status(404).json({ 
                success: false,
                message: "COMPANY NOT FOUND in database",
                companyId: companyId
            });
        }
        
        console.log("Company found in database:", companyExists.name);
        
        let jobs = [];
        try {
            // Try to find jobs with different queries
            const query = { companyId: companyId };
            console.log("Query for jobs:", JSON.stringify(query));
            
            jobs = await jobModel.find(query).sort({ createdAt: -1 });
            console.log("Found jobs count:", jobs.length);
            
            // Debug: Check if job model has data
            const totalJobsInDB = await jobModel.countDocuments({});
            console.log("Total jobs in database:", totalJobsInDB);
            
        } catch (error) {
            console.error("Job query error:", error.message);
            return res.status(200).json({ 
                success: true,
                count: 0,
                message: "No jobs found or error querying",
                jobs: [] 
            });
        }
        
        return res.status(200).json({ 
            success: true,
            count: jobs.length,
            company: {
                id: companyId,
                name: req.user.name,
                email: req.user.email
            },
            jobs: jobs 
        });
    } catch (err) {
        console.error("Error in getCompanyJobs:", err);
        return res.status(500).json({ 
            success: false,
            message: "Server error fetching jobs",
            error: err.message,
            jobs: [] 
        });
    }
}

// CREATE JOB
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      type,
      salary,
      requirements,
      minCGPA,
      eligibleBranches,
      deadline,
      workMode,
      experienceLevel,
      education,
      skills,
      benefits,
      department,
    } = req.body;

    console.log("Creating job with data:", req.body);

    const company = req.user;
    console.log("Company creating job:", company.name, company._id);

    if (!title || !description || !location || !type) {
      return res.status(400).json({ 
        success: false,
        message: "Title, description, location, and job type are required" 
      });
    }

    let jobType;
    switch(type) {
      case "Full-time":
      case "Part-time":
      case "Contract":
      case "Internship":
        jobType = type;
        break;
      default:
        jobType = "Full-time";
    }

    let requirementsArray = [];
    if (requirements) {
      if (Array.isArray(requirements)) {
        requirementsArray = requirements;
      } else if (typeof requirements === 'string') {
        requirementsArray = requirements.split(',').map(r => r.trim()).filter(r => r);
      }
    }

    let skillsArray = [];
    if (skills) {
      if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (typeof skills === 'string') {
        skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
      }
    }

    let benefitsArray = [];
    if (benefits) {
      if (Array.isArray(benefits)) {
        benefitsArray = benefits;
      } else if (typeof benefits === 'string') {
        benefitsArray = benefits.split(',').map(b => b.trim()).filter(b => b);
      }
    }

    let eligibleBranchesArray = ["All"];
    if (eligibleBranches) {
      if (Array.isArray(eligibleBranches)) {
        eligibleBranchesArray = eligibleBranches;
      } else if (typeof eligibleBranches === 'string') {
        eligibleBranchesArray = [eligibleBranches];
      }
    }

    const job = new jobModel({
      title,
      description,
      location,
      jobType: jobType,
      salary: salary || "Negotiable",
      companyId: company._id,
      companyName: company.name,
      requirements: requirementsArray,
      minCGPA: minCGPA || 7.0,
      eligibleBranches: eligibleBranchesArray,
      deadline: deadline ? new Date(deadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      workMode: workMode || "onsite",
      experienceLevel: experienceLevel || "mid",
      education: education || "bachelors",
      skills: skillsArray,
      benefits: benefitsArray,
      department: department || "General",
      status: "active",
    });

    console.log("Saving job to database:", job);

    await job.save();

    if (!company.jobs) {
      company.jobs = [];
    }
    company.jobs.push(job._id);
    await company.save();

    console.log("Job created successfully:", job._id);

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job: job,
    });
  } catch (error) {
    console.error("Create job error:", error);
    
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: "Server error" 
    });
  }
};

// Get all applicants for company's jobs
const getApplicants = async (req, res) => {
    try {
        const companyId = req.user._id;
        
        let companyJobs = [];
        try {
            companyJobs = await jobModel.find({ companyId: companyId });
        } catch (jobError) {
            console.log("Job model not available yet:", jobError.message);
            return res.status(200).json({ applicants: [] });
        }
        
        const jobIds = companyJobs.map(job => job._id);
        
        if (jobIds.length === 0) {
            return res.status(200).json({ applicants: [] });
        }
        
        let applications = [];
        try {
            applications = await applicationModel.find({ jobId: { $in: jobIds } })
                .populate('studentId')
                .populate('jobId');
        } catch (appError) {
            console.log("Application model not available yet:", appError.message);
            return res.status(200).json({ applicants: [] });
        }
        
        const formattedApplicants = applications.map(app => {
            const student = app.studentId;
            const job = app.jobId;
            
            return {
                applicationId: app._id,
                studentId: student._id,
                name: student.name,
                email: student.email,
                phone: student.phone,
                branch: student.branch,
                cgpa: student.cgpa,
                rollNo: student.rollNo,
                skills: student.skills || [],
                resume: student.resume,
                jobId: job._id,
                jobTitle: job.title,
                appliedDate: app.appliedDate,
                status: app.status
            };
        });
        
        return res.status(200).json({ applicants: formattedApplicants });
    } catch (err) {
        console.error("Error fetching applicants:", err);
        return res.status(200).json({ applicants: [] });
    }
}

// Get specific job by ID
const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    const companyId = req.user._id;
    
    const job = await jobModel.findOne({ _id: jobId, companyId: companyId });
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    return res.status(200).json(job);
  } catch (err) {
    console.error("Error fetching job by ID:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update job
const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const companyId = req.user._id;
    const updates = req.body;
    
    const job = await jobModel.findOneAndUpdate(
      { _id: jobId, companyId: companyId },
      { $set: updates },
      { new: true, runValidators: true }
    );
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    return res.status(200).json({ 
      message: "Job updated successfully", 
      job 
    });
  } catch (err) {
    console.error("Error updating job:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete job
const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const companyId = req.user._id;
    
    const job = await jobModel.findOneAndDelete({ _id: jobId, companyId: companyId });
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    await companyModel.findByIdAndUpdate(companyId, {
      $pull: { jobs: jobId }
    });
    
    return res.status(200).json({ 
      message: "Job deleted successfully" 
    });
  } catch (err) {
    console.error("Error deleting job:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update job status
const updateJobStatus = async (req, res) => {
  try {
    const jobId = req.params.id;
    const companyId = req.user._id;
    const { status } = req.body;
    
    const job = await jobModel.findOneAndUpdate(
      { _id: jobId, companyId: companyId },
      { $set: { status } },
      { new: true }
    );
    
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    
    return res.status(200).json({ 
      message: "Job status updated successfully", 
      job 
    });
  } catch (err) {
    console.error("Error updating job status:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update application status
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const companyId = req.user._id;
        
        const application = await applicationModel.findById(applicationId)
            .populate('jobId');
        
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        
        if (application.jobId.companyId.toString() !== companyId.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        application.status = status;
        await application.save();
        
        return res.status(200).json({ 
            message: "Application status updated successfully", 
            application: application 
        });
    } catch (err) {
        console.error("Error updating application status:", err);
        return res.status(500).json({ message: "Error updating application status" });
    }
}

// Get company by ID
const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await companyModel.findById(id);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        const companyData = {
            _id: company._id,
            name: company.name,
            email: company.email,
            phone: company.phone,
            website: company.website,
            location: company.location,
            industry: company.industry,
            description: company.description,
            employeeCount: company.employeeCount,
            jobs: company.jobs || [],
            createdAt: company.createdAt,
            updatedAt: company.updatedAt
        };

        return res.status(200).json({ data: companyData });
    } catch (err) {
        console.error("Error fetching company by ID:", err);
        return res.status(500).json({ message: err.message });
    }
}

// Update company profile
const updateCompanyProfile = async (req, res) => {
    try {
        const company = req.user;
        const updates = req.body;

        delete updates.password;
        delete updates.email;
        delete updates._id;
        delete updates.id;

        Object.assign(company, updates);
        const updatedCompany = await company.save();

        const companyData = {
            _id: updatedCompany._id,
            name: updatedCompany.name,
            email: updatedCompany.email,
            phone: updatedCompany.phone,
            website: updatedCompany.website,
            location: updatedCompany.location,
            industry: updatedCompany.industry,
            description: updatedCompany.description,
            employeeCount: updatedCompany.employeeCount,
            jobs: updatedCompany.jobs || [],
            createdAt: updatedCompany.createdAt,
            updatedAt: updatedCompany.updatedAt
        };

        return res.status(200).json({ 
            message: "Company profile updated successfully", 
            data: companyData 
        });
    } catch (err) {
        console.error("Error updating company profile:", err);
        return res.status(500).json({ message: err.message });
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
    updateApplicationStatus,
    getCompanyProfile,
    getDashboardStats,
    getCompanyById,
    updateCompanyProfile,
    createJob,
    getJobById,
    updateJob,
    deleteJob,
    updateJobStatus
};