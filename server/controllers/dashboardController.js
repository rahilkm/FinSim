const profileService = require('../services/profileService');
const { analyzeResilience } = require('../simulation/resilienceAnalyzer');

/**
 * GET /api/dashboard
 * Returns baseline financial metrics computed from the user's financial profile.
 */
exports.getDashboard = async (req, res, next) => {
    try {
        const profile = await profileService.getProfile(req.user._id);
        if (!profile) {
            return res.status(404).json({ error: true, message: 'Financial profile not found.' });
        }

        const metrics = analyzeResilience(profile.toObject());

        res.json({
            net_worth: metrics.net_worth,
            savings_rate: metrics.savings_rate,
            emergency_months: metrics.emergency_months,
            debt_to_income: metrics.debt_to_income,
            financial_health_score: metrics.financial_health_score,
            risk_level: metrics.risk_level,
            asset_allocation: metrics.asset_allocation,
            // Income/expense breakdown for bar chart
            monthly_income: profile.monthly_income,
            monthly_expenses: profile.monthly_expenses,
            existing_emi: profile.existing_emi,
            savings: Math.max((profile.monthly_income || 0) - (profile.monthly_expenses || 0) - (profile.existing_emi || 0), 0),
        });
    } catch (err) {
        next(err);
    }
};
