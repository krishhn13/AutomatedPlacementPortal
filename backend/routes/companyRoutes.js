const express = require('express')
const router = express.Router()
const companyController = require("../controllers/companyController")

router.get("/companies",companyController.getAll);
router.post("/addCompany",companyController.addCompany);








module.exports = router;