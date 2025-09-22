const express = require('express')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret'
const DEFAULT_EXPIRES_IN = '1h' // adjust as needed

function generateToken(payload, expiresIn = DEFAULT_EXPIRES_IN) {
        // payload can be an object like { id: userId, email: userEmail }
        return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

function authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'] || ''
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader

        if (!token) {
                return res.status(401).json({ error: 'Token required' })
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
                if (err) return res.status(403).json({ error: 'Invalid or expired token' })
                req.user = decoded
                next()
        })
}

module.exports = {
        generateToken,
        authenticateToken,
}
