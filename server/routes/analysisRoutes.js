const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const analysisController = require('../controllers/analysisController');

router.get('/resilience', authMiddleware, analysisController.resilience);

module.exports = router;
