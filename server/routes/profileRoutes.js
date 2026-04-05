const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/authMiddleware');
const profileController = require('../controllers/profileController');
const { profileSchema } = require('../simulation/validators');

router.get('/', authMiddleware, profileController.getProfile);
router.post('/', authMiddleware, validate(profileSchema), profileController.upsertProfile);

module.exports = router;
