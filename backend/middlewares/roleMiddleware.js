const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.role) return res.status(403).json({ message: "Role not found" });
        if (!allowedRoles.includes(req.role)) return res.status(403).json({ message: "Access denied" });
        next();
    };
};

module.exports = roleMiddleware;
