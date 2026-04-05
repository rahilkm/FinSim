const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { CLIENT_URL } = require('./config/env');
const { apiLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const simulationRoutes = require('./routes/simulationRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// ─── Global Middleware ──────────────────────────
app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));
app.use('/api', apiLimiter);

// ─── Routes ─────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/simulate', simulationRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error Handling ─────────────────────────────
app.use(errorHandler);

module.exports = app;
