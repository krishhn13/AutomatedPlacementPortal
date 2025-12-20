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
    res.status(200).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ---------- UPDATE PROFILE (FIXED) ---------- */
const updateProfile = async (req, res) => {
  try {
    const updates = {};

    if (req.file) {
      updates.resume = {
        filename: req.file.originalname,
        path: req.file.path,
        size: req.file.size,
        uploadedAt: new Date(),
      };
    }

    const student = await Students.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const resumeUrl = student.resume
      ? `${req.protocol}://${req.get("host")}/${student.resume.path}`
      : null;

    res.status(200).json({
      resume: student.resume
        ? {
            filename: student.resume.filename,
            url: resumeUrl,
            uploadedAt: student.resume.uploadedAt,
            size: student.resume.size,
          }
        : null,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ message: "Server Error" });
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


const deleteResume = async (req, res) => {
  try {
    const student = await Students.findById(req.user._id);

    if (!student || !student.resume) {
      return res.status(404).json({ message: "No resume found" });
    }

    let resumePath = null;

    // 🔹 NEW format (object)
    if (typeof student.resume === "object" && student.resume.path) {
      resumePath = student.resume.path;
    }

    // 🔹 OLD format (string)
    if (typeof student.resume === "string") {
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


module.exports = {
  getProfile,
  updateProfile,
  deleteResume,   
  applyJob,
  getApplicationStatus,
  getAvailableJobs,
};
