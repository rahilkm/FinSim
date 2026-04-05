const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ error: true, message: 'Authentication required' });
        }

        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password_hash');

        if (!user || !user.is_active) {
            return res.status(401).json({ error: true, message: 'User not found or inactive' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: true, message: 'Invalid or expired token' });
    }
};

module.exports = authMiddleware;
