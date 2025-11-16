const express = require('express')
const companyController = require("../controllers/companyController")
const authMiddleware = require("../middlewares/authMiddleware")
const router = express.Router()

// Public routes
router.get("/companies", companyController.getAll);
router.get("/company/:name", companyController.getByName);

// Protected routes (require authentication)
router.post("/addCompany", companyController.addCompany);
router.put("/updateCompany/:name", authMiddleware, companyController.updateCompany);
router.delete("/deleteCompany/:name", authMiddleware, companyController.deleteCompany);

// DASHBOARD ROUTES
router.get("/company/profile/me", authMiddleware, companyController.getCompanyProfile);
router.get("/company/dashboard/stats", authMiddleware, companyController.getDashboardStats);
router.get("/company/jobs", authMiddleware, companyController.getCompanyJobs);
router.get("/company/applicants", authMiddleware, companyController.getApplicants);
router.put("/company/applications/:applicationId/status", authMiddleware, companyController.updateApplicationStatus);

module.exports = router;