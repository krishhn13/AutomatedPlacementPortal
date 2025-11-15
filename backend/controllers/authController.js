const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Student Registration
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, phone, rollNo, branch, cgpa, skills, backlogs } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student
    const student = new Student({
      name,
      email,
      password: hashedPassword,
      phone,
      rollNo,
      branch,
      cgpa: cgpa || null,
      skills: skills || [],
      backlogs: backlogs || 0,
    });

    await student.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: student._id, email: student.email, role: 'student' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        rollNo: student.rollNo,
        branch: student.branch,
        role: 'student'
      }
    });

  } catch (error) {
    console.error('Student registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Student Login
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find student
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: student._id, email: student.email, role: 'student' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        rollNo: student.rollNo,
        branch: student.branch,
        role: 'student'
      }
    });

  } catch (error) {
    console.error('Student login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Company Registration
exports.registerCompany = async (req, res) => {
  try {
    const { name, email, password, phone, website, location, industry, description, employeeCount } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new company - REMOVE any custom id field
    const company = new Company({
      name,
      email,
      password: hashedPassword,
      phone,
      website: website || '',
      location,
      industry,
      description: description || '',
      employeeCount: employeeCount || '',
    });

    await company.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: company._id, email: company.email, role: 'company' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        phone: company.phone,
        website: company.website,
        location: company.location,
        industry: company.industry,
        role: 'company'
      }
    });

  } catch (error) {
    console.error('Company registration error:', error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Company with this email already exists' 
      });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Company Login
exports.loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find company
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: company._id, email: company.email, role: 'company' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        phone: company.phone,
        website: company.website,
        location: company.location,
        industry: company.industry,
        role: 'company'
      }
    });

  } catch (error) {
    console.error('Company login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin Registration
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, department } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      phone,
      department,
    });

    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: admin._id, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        department: admin.department,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: admin._id, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        department: admin.department,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};