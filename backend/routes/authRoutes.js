const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/auth/register/student', authController.registerStudent);
router.post('/auth/login/student', authController.loginStudent);

module.exports = router;
