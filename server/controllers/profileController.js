const profileService = require('../services/profileService');

exports.getProfile = async (req, res, next) => {
    try {
        const profile = await profileService.getProfile(req.user._id);
        if (!profile) {
            return res.status(404).json({ error: true, message: 'Financial profile not found. Please create one.' });
        }
        res.json(profile);
    } catch (err) {
        next(err);
    }
};

exports.upsertProfile = async (req, res, next) => {
    try {
        const profile = await profileService.upsertProfile(req.user._id, req.body);
        res.json(profile);
    } catch (err) {
        next(err);
    }
};
