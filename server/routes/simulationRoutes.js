const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');
const simulationController = require('../controllers/simulationController');
const { shockSchema, decisionSchema } = require('../simulation/validators');

router.post('/shock', authMiddleware, validate(shockSchema), simulationController.shock);
router.post('/decision', authMiddleware, validate(decisionSchema), simulationController.decision);

module.exports = router;
