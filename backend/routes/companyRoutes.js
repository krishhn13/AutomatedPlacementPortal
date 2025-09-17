const express = require('express')
const companyController = require("../controllers/companyController")
const router = express.Router()

router.get("/companies",companyController.getAll);
router.get("/company/:name",companyController.getByName);
router.post("/addCompany",companyController.addCompany);
router.put("/updateCompany/:name",companyController.updateCompany);
router.delete("/deleteCompany/:name",companyController.deleteCompany);


module.exports = router;