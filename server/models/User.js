const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// Strip password from JSON output
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password_hash;
    return obj;
};

module.exports = mongoose.model('User', userSchema);
