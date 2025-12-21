const express = require("express");
const companyController = require("../controllers/companyController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/* ============================
   PUBLIC ROUTES
============================ */

// Get all companies
router.get("/companies", companyController.getAll);

// Get company by ID
router.get("/companies/:id", companyController.getCompanyById);


/* ============================
   PROTECTED ROUTES (AUTH)
============================ */

// Add company
router.post("/addCompany", companyController.addCompany);

// Company dashboard/profile
router.get("/company/profile/me", authMiddleware, companyController.getCompanyProfile);
router.put("/company/profile/me", authMiddleware, companyController.updateCompanyProfile);

// Dashboard stats
router.get("/company/dashboard/stats", authMiddleware, companyController.getDashboardStats);


/* ============================
   JOB ROUTES (VERY IMPORTANT: ABOVE :name)
============================ */

// Get all jobs of logged-in company
router.get("/company/jobs", authMiddleware, companyController.getCompanyJobs);

// Create job
router.post("/company/jobs", authMiddleware, companyController.createJob);

// Job by ID
router.get("/company/jobs/:id", authMiddleware, companyController.getJobById);
router.put("/company/jobs/:id", authMiddleware, companyController.updateJob);
router.delete("/company/jobs/:id", authMiddleware, companyController.deleteJob);

// Update job status
router.put(
  "/company/jobs/:id/status",
  authMiddleware,
  companyController.updateJobStatus
);


/* ============================
   APPLICATION ROUTES
============================ */

// Get applicants for company jobs
router.get("/company/applicants", authMiddleware, companyController.getApplicants);

// Update application status
router.put(
  "/company/applications/:applicationId/status",
  authMiddleware,
  companyController.updateApplicationStatus
);


/* ============================
   COMPANY NAME ROUTES (KEEP LAST)
============================ */


router.get("/company/:name", companyController.getByName);

// Update company by name
router.put("/updateCompany/:name", authMiddleware, companyController.updateCompany);

// Delete company by name
router.delete("/deleteCompany/:name", authMiddleware, companyController.deleteCompany);

module.exports = router;
