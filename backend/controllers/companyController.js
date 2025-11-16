const companyModel = require("../models/Company")
const jobModel = require("../models/Job")
const applicationModel = require("../models/Application")
const studentModel = require("../models/Student")

// Get all companies
const getAll = async (req, res) => {
    try {
        return res.status(200).json({"data": await companyModel.find()});
    } catch(err) {
        res.status(500).json({message:err.message})
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
        res.status(500).json({message:err.message})
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

// Get company profile for dashboard - UPDATED FOR YOUR MIDDLEWARE
const getCompanyProfile = async (req, res) => {
    try {
        const company = req.user; // From auth middleware
        
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Return company data without password
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

// Get dashboard stats - UPDATED FOR YOUR MIDDLEWARE
const getDashboardStats = async (req, res) => {
    try {
        const companyId = req.user._id; // From auth middleware

        // Get job stats
        let totalJobs = 0;
        let activeJobs = 0;
        try {
            totalJobs = await jobModel.countDocuments({ companyId: companyId });
            activeJobs = await jobModel.countDocuments({ 
                companyId: companyId, 
                status: 'active' 
            });
        } catch (jobError) {
            console.log("Job model not available yet");
        }

        // Get application stats
        let totalApplications = 0;
        let pendingApplications = 0;
        let hiredCount = 0;
        
        try {
            const companyJobs = await jobModel.find({ companyId: companyId });
            const jobIds = companyJobs.map(job => job._id);
            
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
            }
        } catch (appError) {
            console.log("Application model not available yet");
        }

        res.json({
            totalJobs,
            activeJobs,
            totalApplications,
            pendingApplications,
            hiredCount
        });
    } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        res.status(500).json({ message: "Error fetching dashboard stats" });
    }
}

// Get company's jobs - UPDATED FOR YOUR MIDDLEWARE
const getCompanyJobs = async (req, res) => {
    try {
        const companyId = req.user._id; // From auth middleware
        const { limit, page } = req.query;
        
        let jobs = [];
        try {
            const query = { companyId: companyId };
            let jobsQuery = jobModel.find(query).sort({ createdAt: -1 });
            
            if (limit) {
                jobsQuery = jobsQuery.limit(parseInt(limit));
            }
            
            jobs = await jobsQuery;
        } catch (error) {
            console.log("Job model not available yet:", error.message);
        }
        
        return res.status(200).json({ jobs: jobs });
    } catch (err) {
        console.error("Error fetching company jobs:", err);
        return res.status(200).json({ jobs: [] });
    }
}

// Get all applicants for company's jobs - UPDATED FOR YOUR MIDDLEWARE
const getApplicants = async (req, res) => {
    try {
        const companyId = req.user._id; // From auth middleware
        
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

// Update application status - UPDATED FOR YOUR MIDDLEWARE
const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        const companyId = req.user._id; // From auth middleware
        
        // Find the application and verify it belongs to company's job
        const application = await applicationModel.findById(applicationId)
            .populate('jobId');
        
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        
        // Verify the job belongs to the company
        if (application.jobId.companyId.toString() !== companyId.toString()) {
            return res.status(403).json({ message: "Access denied" });
        }
        
        // Update the application status
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

// Get company by ID - NEW METHOD
const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await companyModel.findById(id);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // Return company data without password
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

// Update company profile - NEW METHOD
const updateCompanyProfile = async (req, res) => {
    try {
        const company = req.user; // From auth middleware
        const updates = req.body;

        // Remove fields that shouldn't be updated
        delete updates.password;
        delete updates.email;
        delete updates._id;
        delete updates.id;

        Object.assign(company, updates);
        const updatedCompany = await company.save();

        // Return updated company data without password
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
    updateCompanyProfile
}