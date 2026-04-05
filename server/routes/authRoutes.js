const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validate = require('../middleware/validate');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
