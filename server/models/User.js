const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        full_name: {
            type: String,
            default: '',
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password_hash: {
            type: String,
            required: [true, 'Password is required'],
        },
        is_active: {
            type: Boolean,
            default: true,
        },
        last_login: {
            type: Date,
        },
        // Password reset
        reset_token: {
            type: String,
            default: null,
        },
        reset_token_expires: {
            type: Date,
            default: null,
        },
    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password_hash')) return next();
    this.password_hash = await bcrypt.hash(this.password_hash, 12);
    next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password_hash);
};

// Generate a password reset token (returns raw token; stores hashed version)
userSchema.methods.generateResetToken = function () {
    const rawToken = crypto.randomBytes(32).toString('hex');
    this.reset_token = crypto.createHash('sha256').update(rawToken).digest('hex');
    this.reset_token_expires = Date.now() + 15 * 60 * 1000; // 15 minutes
    return rawToken;
};

// Strip sensitive fields from JSON output
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password_hash;
    delete obj.reset_token;
    delete obj.reset_token_expires;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
