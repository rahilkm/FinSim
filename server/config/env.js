const dotenv = require('dotenv');
const path = require('path');

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const required = ['MONGO_URI', 'JWT_SECRET'];

required.forEach((key) => {
    if (!process.env[key]) {
        console.error(`FATAL: Missing required env variable ${key}`);
        process.exit(1);
    }
});

module.exports = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    PORT: parseInt(process.env.PORT, 10) || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
