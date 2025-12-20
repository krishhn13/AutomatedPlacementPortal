const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const ensureUploadsDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/* ---------- Multer config for RESUME ---------- */
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/resumes";
    ensureUploadsDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `resume-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const resumeFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files allowed"), false);
  }
};

const uploadResume = multer({ 
  storage: resumeStorage, 
  fileFilter: resumeFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/* ---------- Multer config for PROFILE PHOTO ---------- */
const profilePhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/profile-photos";
    ensureUploadsDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `profile-${req.user._id}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const profilePhotoFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }
};

const uploadProfilePhoto = multer({ 
  storage: profilePhotoStorage, 
  fileFilter: profilePhotoFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/* ---------- Routes ---------- */
// Profile routes
router.get(
  "/student/profile",
  authMiddleware,
  roleMiddleware(["student"]),
  studentController.getProfile
);

router.put(
  "/student/profile",
  authMiddleware,
  roleMiddleware(["student"]),
  studentController.updateProfile
);

// Profile photo routes
router.post(
  "/student/profile/photo",
  authMiddleware,
  roleMiddleware(["student"]),
  uploadProfilePhoto.single("profilePhoto"),
  studentController.uploadProfilePhoto
);

router.delete(
  "/student/profile/photo",
  authMiddleware,
  roleMiddleware(["student"]),
  studentController.deleteProfilePhoto
);

// Resume routes
router.put(
  "/student/resume",
  authMiddleware,
  roleMiddleware(["student"]),
  uploadResume.single("resume"),
  studentController.updateResume
);

router.delete(
  "/student/resume",
  authMiddleware,
  roleMiddleware(["student"]),
  studentController.deleteResume
);

// Job application routes
router.post(
  "/student/apply/:jobId",
  authMiddleware,
  roleMiddleware(["student"]),
  studentController.applyJob
);

router.get(
  "/student/status",
  authMiddleware,
  roleMiddleware(["student"]),
  studentController.getApplicationStatus
);

router.get(
  "/student/jobs",
  authMiddleware,
  roleMiddleware(["student"]),
  studentController.getAvailableJobs
);

module.exports = router;