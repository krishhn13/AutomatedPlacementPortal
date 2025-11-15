const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Student routes
router.post('/register/student', authController.registerStudent);
router.post('/login/student', authController.loginStudent);

// Company routes
router.post('/register/company', authController.registerCompany);
router.post('/login/company', authController.loginCompany);

// Admin routes
router.post('/register/admin', authController.registerAdmin);
router.post('/login/admin', authController.loginAdmin);

module.exports = router;