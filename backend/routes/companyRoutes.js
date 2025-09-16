const express = require('express')
const router = express.Router()
const companyController = require("../controllers/companyController")

router.get("/companies",companyController.getAll);
// router.get("/company/:name",companyController.getByName);
router.post("/addCompany",companyController.addCompany);
// router.put("/updateCompany",companyController.updateCompany);
// router.delete("/deleteCompany",companyController.deleteCompany);



module.exports = router;