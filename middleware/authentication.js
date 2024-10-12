const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const tokenWithoutBearer = token.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

const isRegistered = (req, res, next) => {
    if (req.user && req.user.role !== 'guest') {
        return next();
    }
    return res.status(403).json({ message: 'Guests are not allowed to perform this action' });
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Only admins can perform this action' });
};

module.exports = { isAuthenticated, isRegistered, isAdmin };