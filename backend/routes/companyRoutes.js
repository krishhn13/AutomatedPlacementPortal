const express = require('express')
const companyController = require("../controllers/companyController")
const authMiddleware = require("../middleware/authMiddleware") // You'll need this
const router = express.Router()

// Existing routes
router.get("/companies", companyController.getAll);
router.get("/company/:name", companyController.getByName);
router.post("/addCompany", companyController.addCompany);
router.put("/updateCompany/:name", companyController.updateCompany);
router.delete("/deleteCompany/:name", companyController.deleteCompany);

// NEW ROUTES FOR APPLICANT MANAGEMENT
router.get("/company/applicants", authMiddleware, companyController.getApplicants);
router.get("/company/jobs", authMiddleware, companyController.getCompanyJobs);
router.put("/company/applications/:applicationId/status", authMiddleware, companyController.updateApplicationStatus);

module.exports = router;