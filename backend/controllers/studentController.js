const Students = require('../models/Student');
const Jobs = require('../models/Job'); 
const Applications = require('../models/Application');


const getProfile = async (req, res) => {
    try {
        const student = await Students.findById(req.user._id).select('-password');
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.status(200).json(student);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        if (req.file) updates.resume = req.file.path;

        const student = await Students.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({ message: "Profile updated", student });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

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

const getApplicationStatus = async (req, res) => {
    try {
        const student = await Students.findById(req.user._id).select('appliedJobs status');
        res.status(200).json({ appliedJobs: student.appliedJobs, status: student.status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};


const getAvailableJobs = async (req, res) => {
    try {
        const student = await Students.findById(req.user._id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        const jobs = await Jobs.find();

        const jobList = jobs.map(job => {
            const eligible =
                (!job.minCGPA || student.cgpa >= job.minCGPA) &&
                (!job.eligibleBranches || job.eligibleBranches.includes(student.branch));

            const applied = student.appliedJobs.includes(job._id);

            return {
                id: job._id,
                title: job.title,
                company: job.company,
                location: job.location,
                salary: job.salary,
                type: job.type,
                posted: job.postedAt ? job.postedAt.toDateString() : 'N/A',
                deadline: job.deadline ? job.deadline.toDateString() : 'N/A',
                eligible,
                applied,
                description: job.description || '',
                requirements: job.requirements || [],
                logo: job.logo || '',
            };
        });

        res.status(200).json(jobList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

// ------------------- EXPORTS -------------------

module.exports = {
    getProfile,
    updateProfile,
    applyJob,
    getApplicationStatus,
    getAvailableJobs
};
