const profileService = require('../services/profileService');
const { simulateShock } = require('../simulation/shockSimulator');
const { simulateDecision } = require('../simulation/decisionSimulator');
const { generateRecommendations } = require('../simulation/recommendationEngine');
const Simulation = require('../models/Simulation');
const Recommendation = require('../models/Recommendation');
const auditService = require('../services/auditService');

exports.shock = async (req, res, next) => {
    try {
        const profile = await profileService.getProfile(req.user._id);
        if (!profile) {
            return res.status(400).json({ error: true, message: 'Create a financial profile first.' });
        }

        const results = simulateShock(profile.toObject(), req.body);
        const recommendations = generateRecommendations(results);

        const sim = await Simulation.create({
            user_id: req.user._id,
            simulation_type: 'shock',
            input_parameters: req.body,
            result_metrics: results,
        });

        await Promise.all(
            recommendations.map((r) =>
                Recommendation.create({
                    user_id: req.user._id,
                    simulation_id: sim._id,
                    recommendation_text: r.text,
                    recommendation_type: r.type,
                })
            )
        );

        await auditService.log(req.user._id, 'SHOCK_SIMULATION', { shock_type: req.body.shock_type });
        res.json({ ...results, recommendations });
    } catch (err) {
        next(err);
    }
};

exports.decision = async (req, res, next) => {
    try {
        const profile = await profileService.getProfile(req.user._id);
        if (!profile) {
            return res.status(400).json({ error: true, message: 'Create a financial profile first.' });
        }

        const results = simulateDecision(profile.toObject(), req.body);
        const recommendations = generateRecommendations(results);

        const sim = await Simulation.create({
            user_id: req.user._id,
            simulation_type: 'decision',
            input_parameters: req.body,
            result_metrics: results,
        });

        await Promise.all(
            recommendations.map((r) =>
                Recommendation.create({
                    user_id: req.user._id,
                    simulation_id: sim._id,
                    recommendation_text: r.text,
                    recommendation_type: r.type,
                })
            )
        );

        await auditService.log(req.user._id, 'DECISION_SIMULATION');
        res.json({ ...results, recommendations });
    } catch (err) {
        next(err);
    }
};
