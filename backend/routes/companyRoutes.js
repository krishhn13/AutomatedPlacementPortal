const express = require('express')
const companyController = require("../controllers/companyController")
const authMiddleware = require("../middlewares/authMiddleware")
const router = express.Router()

// Public routes
router.get("/companies", companyController.getAll);
router.get("/company/:name", companyController.getByName);
router.get("/companies/:id", companyController.getCompanyById);

// Protected routes (require authentication)
router.post("/addCompany", companyController.addCompany);
router.put("/updateCompany/:name", authMiddleware, companyController.updateCompany);
router.delete("/deleteCompany/:name", authMiddleware, companyController.deleteCompany);

// DASHBOARD ROUTES - All protected
router.get("/company/profile/me", authMiddleware, companyController.getCompanyProfile);
router.put("/company/profile/me", authMiddleware, companyController.updateCompanyProfile);
router.get("/company/dashboard/stats", authMiddleware, companyController.getDashboardStats);

// JOB ROUTES
router.get("/company/jobs", authMiddleware, companyController.getCompanyJobs); // Get all company's jobs
router.post("/company/jobs", authMiddleware, companyController.createJob); // Create new job

// Individual job routes (add these)
router.get("/company/jobs/:id", authMiddleware, companyController.getJobById); // Get specific job
router.put("/company/jobs/:id", authMiddleware, companyController.updateJob); // Update job
router.delete("/company/jobs/:id", authMiddleware, companyController.deleteJob); // Delete job
router.put("/company/jobs/:id/status", authMiddleware, companyController.updateJobStatus); // Update job status

router.get("/company/applicants", authMiddleware, companyController.getApplicants);
router.put("/company/applications/:applicationId/status", authMiddleware, companyController.updateApplicationStatus);

module.exports = router;