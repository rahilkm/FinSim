const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10000, // allow almost unlimited requests for demo
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: true, message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10000, // allow almost unlimited requests for demo
    message: { error: true, message: 'Too many auth attempts, please try again later.' },
});

module.exports = { apiLimiter, authLimiter };
