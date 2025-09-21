const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/resumes';
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDF files allowed'), false);
};
const upload = multer({ storage, fileFilter });

router.get('/student/profile', authMiddleware, roleMiddleware(['student']), studentController.getProfile);
router.put('/student/profile', authMiddleware, roleMiddleware(['student']), upload.single('resume'), studentController.updateProfile);
router.post('/student/apply/:jobId', authMiddleware, roleMiddleware(['student']), studentController.applyJob);
router.get('/student/status', authMiddleware, roleMiddleware(['student']), studentController.getApplicationStatus);

module.exports = router;
