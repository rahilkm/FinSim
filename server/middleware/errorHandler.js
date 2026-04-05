const logger = require('../config/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
    logger.error(err.message, { stack: err.stack });

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ error: true, message: messages.join('; ') });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        return res.status(409).json({ error: true, message: 'Duplicate entry. Record already exists.' });
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: true, message: 'Invalid or expired token' });
    }

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: true,
        message: statusCode === 500 ? 'Internal server error' : err.message,
    });
};

module.exports = errorHandler;
