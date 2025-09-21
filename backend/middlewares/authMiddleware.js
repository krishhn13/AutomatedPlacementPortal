const jwt = require('jsonwebtoken');
const Students = require('../models/Student');
const Companies = require('../models/Company');
const Admins = require('../models/Admin');

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer '))
            return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const { id, role } = decoded;

        if (role === 'student') req.user = await Students.findById(id).select('-password');
        else if (role === 'company') req.user = await Companies.findById(id).select('-password');
        else if (role === 'admin') req.user = await Admins.findById(id).select('-password');
        else return res.status(401).json({ message: "Invalid role" });

        req.role = role;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Unauthorized, invalid token" });
    }
};

module.exports = authMiddleware;
