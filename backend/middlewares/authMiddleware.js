const jwt = require('jsonwebtoken');
const Students = require('../models/Student');
const Companies = require('../models/Company');
const Admins = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const authMiddleware = async (req, res, next) => {
    try {
        console.log("Auth middleware called");
        console.log("Headers:", req.headers);
        
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log("No token or invalid auth header");
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(' ')[1];
        console.log("Token received:", token.substring(0, 20) + "...");
        
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("Decoded token:", decoded);
        
        const { id, role } = decoded;

        let user = null;
        if (role === 'student') {
            user = await Students.findById(id).select('-password');
        } else if (role === 'company') {
            user = await Companies.findById(id).select('-password');
        } else if (role === 'admin') {
            user = await Admins.findById(id).select('-password');
        } else {
            console.log("Invalid role:", role);
            return res.status(401).json({ message: "Invalid role" });
        }

        if (!user) {
            console.log("User not found for ID:", id, "Role:", role);
            return res.status(401).json({ message: "User not found" });
        }

        console.log("User found:", user.name, "ID:", user._id, "Role:", role);
        
        req.user = user;
        req.role = role;
        next();
    } catch (err) {
        console.error("Auth middleware error:", err.message);
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: "Invalid token" });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" });
        }
        res.status(401).json({ message: "Unauthorized, invalid token" });
    }
};

module.exports = authMiddleware;