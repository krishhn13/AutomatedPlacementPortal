const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Public routes
router.post('/register/student', authController.registerStudent);
router.post('/login/student', authController.loginStudent);

router.post('/register/company', authController.registerCompany);
router.post('/login/company', authController.loginCompany);

router.post('/register/admin', authController.registerAdmin);
router.post('/login/admin', authController.loginAdmin);

router.get('/verify', authController.verifyToken);

// Protected routes
router.get('/me', authMiddleware, authController.getCurrentUser);
router.put('/change-password', authMiddleware, authController.changePassword);

module.exports = router;