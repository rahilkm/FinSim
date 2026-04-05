const profileService = require('../services/profileService');
const { analyzeResilience } = require('../simulation/resilienceAnalyzer');
const { generateRecommendations } = require('../simulation/recommendationEngine');
const Simulation = require('../models/Simulation');
const auditService = require('../services/auditService');

exports.resilience = async (req, res, next) => {
    try {
        const profile = await profileService.getProfile(req.user._id);
        if (!profile) {
            return res.status(400).json({ error: true, message: 'Create a financial profile first.' });
        }

        const profileObj = profile.toObject();
        const results = analyzeResilience(profileObj);
        const recommendations = generateRecommendations(results);

        await Simulation.create({
            user_id: req.user._id,
            simulation_type: 'resilience',
            input_parameters: {},
            result_metrics: results,
        });

        await auditService.log(req.user._id, 'RESILIENCE_ANALYSIS');
        res.json({ ...results, recommendations });
    } catch (err) {
        next(err);
    }
};
