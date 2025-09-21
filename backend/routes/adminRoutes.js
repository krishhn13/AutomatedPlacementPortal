const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get(
    '/admin/reports',
    authMiddleware,
    roleMiddleware(['admin']),
    adminController.getPlacementReports
);

module.exports = router;