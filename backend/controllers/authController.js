const Students = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const registerStudent = async (req, res) => {
    try {
        const { name, rollNo, email, password, branch, cgpa, skills, backlogs } = req.body;
        const existing = await Students.findOne({ $or: [{ email }, { rollNo }] });

        if (existing) return res.status(400).json({ message: "Student already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const student = new Students({
            name,
            rollNo,
            email,
            password: hashedPassword,
            branch,
            cgpa,
            skills,
            backlogs,
            role: "student"
        });

        await student.save();
        res.status(201).json({ message: "Student registered successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;
        const student = await Students.findOne({ email });
        
        if (!student) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: student._id, role: student.role }, JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            message: "Login successful",
            token,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                rollNo: student.rollNo,
                branch: student.branch,
                cgpa: student.cgpa,
                skills: student.skills,
                resume: student.resume
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { registerStudent, loginStudent };
