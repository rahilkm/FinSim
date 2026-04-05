const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');

function generateToken(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

async function register(full_name, email, password) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const err = new Error('Email already registered');
        err.statusCode = 409;
        throw err;
    }

    const user = new User({ full_name, email, password_hash: password });
    await user.save();

    const token = generateToken(user._id);
    return { token, user_id: user._id, email: user.email, full_name: user.full_name };
}

async function login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
        const err = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        const err = new Error('Invalid email or password');
        err.statusCode = 401;
        throw err;
    }

    user.last_login = new Date();
    await user.save();

    const token = generateToken(user._id);
    return { token, user_id: user._id, email: user.email, full_name: user.full_name };
}

async function getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }
    return user;
}

module.exports = { register, login, getMe };
