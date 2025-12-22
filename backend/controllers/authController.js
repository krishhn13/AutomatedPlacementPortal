const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Admin = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Student Registration
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password, phone, rollNo, branch, year, location, cgpa, skills, backlogs } = req.body;

    console.log('Student Registration request body:', req.body);

    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student already exists with this email' });
    }

    if (!year) {
      return res.status(400).json({ message: 'Year field is required' });
    }
    
    if (!location) {
      return res.status(400).json({ message: 'Location field is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new Student({
      name,
      email,
      password: hashedPassword,
      phone,
      rollNo,
      branch,
      year: year.toString().trim(),
      location: location.toString().trim(),
      cgpa: cgpa ? parseFloat(cgpa) : null,
      skills: skills || [],
      backlogs: backlogs || 0,
    });

    console.log('Student object to save:', student);

    await student.save();

    const token = jwt.sign(
      { id: student._id, role: 'student' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: student._id,
        _id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        rollNo: student.rollNo,
        branch: student.branch,
        year: student.year,
        location: student.location,
        cgpa: student.cgpa,
        skills: student.skills,
        backlogs: student.backlogs,
        role: 'student'
      }
    });

  } catch (error) {
    console.error('Student registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Student with this email or roll number already exists' 
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation Error', 
        errors: messages 
      });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Student Login
exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: student._id, role: 'student' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: student._id,
        _id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        rollNo: student.rollNo,
        branch: student.branch,
        year: student.year,
        location: student.location,
        cgpa: student.cgpa,
        skills: student.skills,
        backlogs: student.backlogs,
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

    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company already exists with this email' });
    }

    const existingCompanyName = await Company.findOne({ name });
    if (existingCompanyName) {
      return res.status(400).json({ message: 'Company with this name already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

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

    const token = jwt.sign(
      { id: company._id, role: 'company' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: company._id,
        _id: company._id,
        name: company.name,
        email: company.email,
        phone: company.phone,
        website: company.website,
        location: company.location,
        industry: company.industry,
        description: company.description,
        employeeCount: company.employeeCount,
        role: 'company'
      }
    });

  } catch (error) {
    console.error('Company registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Company with this email or name already exists' 
      });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Company Login
exports.loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, company.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: company._id, role: 'company' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: company._id,
        _id: company._id,
        name: company.name,
        email: company.email,
        phone: company.phone,
        website: company.website,
        location: company.location,
        industry: company.industry,
        description: company.description,
        employeeCount: company.employeeCount,
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
    const { name, email, password, phone, department, designation } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      phone,
      department,
      designation
    });

    await admin.save();

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: admin._id,
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        department: admin.department,
        designation : admin.designation,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Admin registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Admin with this email already exists' 
      });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: admin._id,
        _id: admin._id,
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

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    const user = req.user;
    const role = req.role;

    res.json({
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: role,
        ...(role === 'student' && {
          phone: user.phone,
          rollNo: user.rollNo,
          branch: user.branch,
          year: user.year,
          location: user.location,
          cgpa: user.cgpa,
          skills: user.skills,
          backlogs: user.backlogs
        }),
        ...(role === 'company' && {
          phone: user.phone,
          website: user.website,
          location: user.location,
          industry: user.industry,
          description: user.description,
          employeeCount: user.employeeCount
        }),
        ...(role === 'admin' && {
          phone: user.phone,
          department: user.department
        })
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const user = req.user;
    const role = req.role;
    const { currentPassword, newPassword } = req.body;

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Verify token
exports.verifyToken = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    let user;
    switch (decoded.role) {
      case 'student':
        user = await Student.findById(decoded.id).select('-password');
        break;
      case 'company':
        user = await Company.findById(decoded.id).select('-password');
        break;
      case 'admin':
        user = await Admin.findById(decoded.id).select('-password');
        break;
      default:
        return res.status(400).json({ message: 'Invalid user role' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      valid: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        role: decoded.role,
        ...(decoded.role === 'student' && {
          phone: user.phone,
          rollNo: user.rollNo,
          branch: user.branch,
          year: user.year,
          location: user.location
        }),
        ...(decoded.role === 'company' && {
          phone: user.phone,
          website: user.website,
          location: user.location,
          industry: user.industry
        }),
        ...(decoded.role === 'admin' && {
          phone: user.phone,
          department: user.department
        })
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.json({ valid: false, message: 'Invalid token' });
  }
};