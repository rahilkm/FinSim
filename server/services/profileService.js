const FinancialProfile = require('../models/FinancialProfile');

/**
 * Compute derived totals from structured arrays.
 * Also extracts convenience savings/investments values from the assets array.
 */
function computeDerivedTotals(data) {
    const monthly_income = (data.income_sources || []).reduce((s, x) => s + (x.amount || 0), 0);
    const monthly_expenses = (data.expenses || []).reduce((s, x) => s + (x.amount || 0), 0);
    const total_assets = (data.assets || []).reduce((s, x) => s + (x.value || 0), 0);
    const total_liabilities = (data.liabilities || []).reduce((s, x) => s + (x.value || 0), 0);

    // Convenience scalars extracted from asset list by name (case-insensitive)
    const findAssetValue = (assets, keyword) => {
        const item = (assets || []).find((a) => a.name && a.name.toLowerCase().includes(keyword));
        return item ? item.value : 0;
    };

    const savings = findAssetValue(data.assets, 'saving');
    const investments = findAssetValue(data.assets, 'invest');

    return { monthly_income, monthly_expenses, total_assets, total_liabilities, savings, investments };
}

async function getProfile(userId) {
    const profile = await FinancialProfile.findOne({ user_id: userId });
    return profile;
}

async function upsertProfile(userId, data) {
    const derived = computeDerivedTotals(data);

    const profile = await FinancialProfile.findOneAndUpdate(
        { user_id: userId },
        { ...data, user_id: userId, ...derived },
        { new: true, upsert: true, runValidators: false }
    );
    return profile;
}

module.exports = { getProfile, upsertProfile };
