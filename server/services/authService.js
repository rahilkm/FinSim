const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env');
const { sendResetEmail } = require('./emailService');

// ── Login attempt tracking (in-memory) ───────────────────────────────────────
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 2 * 60 * 1000; // 2 minutes

// Map<email, { count: number, lockedUntil: number | null }>
const loginAttempts = new Map();

function getAttemptInfo(email) {
    const key = email.toLowerCase();
    if (!loginAttempts.has(key)) {
        loginAttempts.set(key, { count: 0, lockedUntil: null });
    }
    return loginAttempts.get(key);
}

function resetAttempts(email) {
    loginAttempts.delete(email.toLowerCase());
}

function recordFailedAttempt(email) {
    const info = getAttemptInfo(email);
    info.count += 1;
    if (info.count >= MAX_ATTEMPTS) {
        info.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    }
    return info;
}
// ─────────────────────────────────────────────────────────────────────────────

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
    // ── Check lockout ────────────────────────────────
    const attemptInfo = getAttemptInfo(email);

    if (attemptInfo.lockedUntil) {
        const remaining = attemptInfo.lockedUntil - Date.now();
        if (remaining > 0) {
            const err = new Error('Account temporarily locked due to too many failed attempts. Please try again later.');
            err.statusCode = 429;
            err.lockout = true;
            err.lockoutSeconds = Math.ceil(remaining / 1000);
            throw err;
        }
        // Lockout expired — reset
        resetAttempts(email);
    }

    // ── Validate credentials ─────────────────────────
    const user = await User.findOne({ email });
    if (!user) {
        const info = recordFailedAttempt(email);
        const attemptsLeft = Math.max(0, MAX_ATTEMPTS - info.count);
        const err = new Error(
            attemptsLeft > 0
                ? `Invalid email or password. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining.`
                : 'Account temporarily locked due to too many failed attempts. Please try again later.'
        );
        err.statusCode = attemptsLeft > 0 ? 401 : 429;
        err.attemptsLeft = attemptsLeft;
        err.lockout = attemptsLeft === 0;
        if (err.lockout) err.lockoutSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
        throw err;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        const info = recordFailedAttempt(email);
        const attemptsLeft = Math.max(0, MAX_ATTEMPTS - info.count);
        const err = new Error(
            attemptsLeft > 0
                ? `Invalid email or password. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining.`
                : 'Account temporarily locked due to too many failed attempts. Please try again later.'
        );
        err.statusCode = attemptsLeft > 0 ? 401 : 429;
        err.attemptsLeft = attemptsLeft;
        err.lockout = attemptsLeft === 0;
        if (err.lockout) err.lockoutSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
        throw err;
    }

    // ── Success — reset attempts ─────────────────────
    resetAttempts(email);

    user.last_login = new Date();
    await user.save();

    const token = generateToken(user._id);
    return { token, user_id: user._id, email: user.email, full_name: user.full_name };
}

async function forgotPassword(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        // Don't reveal whether the email exists — always return success
        return { message: 'If that email is registered, a reset link has been sent.' };
    }

    const rawToken = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    // Send reset email (falls back to console if SMTP not configured)
    await sendResetEmail(user.email, rawToken);

    return {
        message: 'If that email is registered, a reset link has been sent.',
    };
}

async function resetPassword(token, newPassword) {
    if (!token || !newPassword) {
        const err = new Error('Token and new password are required');
        err.statusCode = 400;
        throw err;
    }

    if (newPassword.length < 6) {
        const err = new Error('Password must be at least 6 characters');
        err.statusCode = 400;
        throw err;
    }

    // Hash the incoming token and find matching user
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
        reset_token: hashedToken,
        reset_token_expires: { $gt: Date.now() },
    });

    if (!user) {
        const err = new Error('Reset token is invalid or has expired');
        err.statusCode = 400;
        throw err;
    }

    // Update password and clear reset token
    user.password_hash = newPassword;
    user.reset_token = null;
    user.reset_token_expires = null;
    await user.save();

    return { message: 'Password reset successfully. You can now sign in.' };
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

module.exports = { register, login, forgotPassword, resetPassword, getMe };
