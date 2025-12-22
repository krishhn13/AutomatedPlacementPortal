const Students = require("../models/Student");
const Jobs = require("../models/Job");
const fs = require("fs");
const path = require("path");


/* ---------- GET PROFILE ---------- */
const getProfile = async (req, res) => {
  try {
    const student = await Students.findById(req.user._id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    // Convert to plain object and add profile photo URL
    const studentObj = student.toObject();
    
    if (studentObj.profilePhoto) {
      // Add timestamp to prevent caching
      const timestamp = studentObj.profilePhoto.uploadedAt 
        ? new Date(studentObj.profilePhoto.uploadedAt).getTime()
        : Date.now();
      
      studentObj.profilePhotoUrl = `${req.protocol}://${req.get("host")}/${studentObj.profilePhoto.path}?t=${timestamp}`;
    }
    
    if (studentObj.resume) {
      const timestamp = studentObj.resume.uploadedAt 
        ? new Date(studentObj.resume.uploadedAt).getTime()
        : Date.now();
      
      studentObj.resumeUrl = `${req.protocol}://${req.get("host")}/${studentObj.resume.path}?t=${timestamp}`;
    }
    
    res.status(200).json(studentObj);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ---------- UPDATE PROFILE ---------- */
const updateProfile = async (req, res) => {
  try {
    const { phone, location, year, skills, backlogs } = req.body;
    const updates = {};

    if (phone !== undefined) updates.phone = phone;
    if (location !== undefined) updates.location = location;
    if (year !== undefined) updates.year = year;
    if (skills !== undefined) updates.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(s => s);
    if (backlogs !== undefined) updates.backlogs = parseInt(backlogs) || 0;

    const student = await Students.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ---------- UPLOAD PROFILE PHOTO ---------- */
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const student = await Students.findById(req.user._id);
    if (!student) {
      // Delete uploaded file since student not found
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete old profile photo if exists
    if (student.profilePhoto && student.profilePhoto.path) {
      const oldPhotoPath = path.join(__dirname, "..", student.profilePhoto.path);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    // Update student's profile photo
    student.profilePhoto = {
      filename: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      uploadedAt: new Date(),
    };

    await student.save();

    // ADD CACHE-BUSTING TIMESTAMP HERE
    const timestamp = Date.now();
    const photoUrl = `${req.protocol}://${req.get("host")}/${student.profilePhoto.path}?t=${timestamp}`;

    res.status(200).json({
      message: "Profile photo uploaded successfully",
      profilePhotoUrl: photoUrl,  // This now has ?t=timestamp
      profilePhoto: student.profilePhoto
    });

  } catch (err) {
    console.error("Upload profile photo error:", err);
    
    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const students = await Students.find().select("-password");
    const studentList = students.map((student) => {
      const obj = student.toObject();

      if (obj.profilePhoto && obj.profilePhoto.path) {
        const ts = obj.profilePhoto.uploadedAt
          ? new Date(obj.profilePhoto.uploadedAt).getTime()
          : Date.now();
        obj.profilePhotoUrl = `${req.protocol}://${req.get("host")}/${obj.profilePhoto.path}?t=${ts}`;
      }

      if (obj.resume && obj.resume.path) {
        const ts = obj.resume.uploadedAt
          ? new Date(obj.resume.uploadedAt).getTime()
          : Date.now();
        obj.resumeUrl = `${req.protocol}://${req.get("host")}/${obj.resume.path}?t=${ts}`;
      }

      return obj;
    });

    res.status(200).json(studentList);
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};


/* ---------- DELETE PROFILE PHOTO ---------- */
const deleteProfilePhoto = async (req, res) => {
  try {
    const student = await Students.findById(req.user._id);
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    
    if (!student.profilePhoto || !student.profilePhoto.path) {
      return res.status(404).json({ message: "No profile photo found" });
    }

    // Delete the file from storage
    const filePath = path.join(__dirname, "..", student.profilePhoto.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove profile photo from student document
    student.profilePhoto = null;
    await student.save();

    res.status(200).json({ 
      message: "Profile photo deleted successfully" 
    });

  } catch (err) {
    console.error("Delete profile photo error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ---------- UPDATE RESUME ---------- */
const updateResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const student = await Students.findById(req.user._id);
    if (!student) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete old resume if exists
    if (student.resume && student.resume.path) {
      const oldResumePath = path.join(__dirname, "..", student.resume.path);
      if (fs.existsSync(oldResumePath)) {
        fs.unlinkSync(oldResumePath);
      }
    }

    // Update student's resume
    student.resume = {
      filename: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      uploadedAt: new Date(),
    };

    await student.save();

    // ADD CACHE-BUSTING TIMESTAMP HERE
    const timestamp = Date.now();
    const resumeUrl = `${req.protocol}://${req.get("host")}/${student.resume.path}?t=${timestamp}`;

    res.status(200).json({
      message: "Resume uploaded successfully",
      resumeUrl: resumeUrl,
      resume: student.resume
    });

  } catch (err) {
    console.error("Update resume error:", err);
    
    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: "Server Error" });
  }
};

/* ---------- DELETE RESUME ---------- */
const deleteResume = async (req, res) => {
  try {
    const student = await Students.findById(req.user._id);

    if (!student || !student.resume) {
      return res.status(404).json({ message: "No resume found" });
    }

    let resumePath = null;

    // Handle different resume formats
    if (typeof student.resume === "object" && student.resume.path) {
      resumePath = student.resume.path;
    } else if (typeof student.resume === "string") {
      resumePath = student.resume;
    }

    // Only delete file if path exists
    if (resumePath) {
      const absolutePath = path.join(__dirname, "..", resumePath);
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
      }
    }

    // Clear resume from DB
    student.resume = null;
    await student.save();

    return res.status(200).json({
      message: "Resume deleted successfully",
    });
  } catch (err) {
    console.error("Delete resume error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* ---------- APPLY JOB ---------- */
const applyJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const student = await Students.findById(req.user._id);
    const job = await Jobs.findById(jobId);

    if (!job) return res.status(404).json({ message: "Job not found" });

    if (!job.eligibleBranches.includes(student.branch))
      return res.status(400).json({ message: "Branch not eligible" });

    if (student.cgpa < job.minCGPA)
      return res.status(400).json({ message: "CGPA too low" });

    if (student.appliedJobs.includes(jobId))
      return res.status(400).json({ message: "Already applied" });

    student.appliedJobs.push(jobId);
    student.status.set(jobId, "Applied");
    await student.save();

    job.applicants.push(student._id);
    await job.save();

    res.status(200).json({ message: "Applied successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ---------- STATUS ---------- */
const getApplicationStatus = async (req, res) => {
  try {
    const student = await Students.findById(req.user._id).select(
      "appliedJobs status"
    );
    res.status(200).json({
      appliedJobs: student.appliedJobs,
      status: student.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ---------- JOBS ---------- */
const getAvailableJobs = async (req, res) => {
  try {
    const student = await Students.findById(req.user._id);
    const jobs = await Jobs.find();

    const jobList = jobs.map((job) => ({
      id: job._id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      type: job.type,
      eligible:
        student.cgpa >= job.minCGPA &&
        job.eligibleBranches.includes(student.branch),
      applied: student.appliedJobs.includes(job._id),
      description: job.description || "",
      requirements: job.requirements || [],
    }));

    res.status(200).json(jobList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getAllUsers,
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  updateResume,
  deleteResume,
  applyJob,
  getApplicationStatus,
  getAvailableJobs,
};