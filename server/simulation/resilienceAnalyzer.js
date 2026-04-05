const {
    netWorth,
    riskLevel,
} = require('../utils/financialMath');

/**
 * Analyze the user's financial resilience and produce a composite health score.
 * Formula per spec: savings_rate = (income - expenses - emi) / income
 */
function analyzeResilience(profile) {
    const {
        monthly_income,
        monthly_expenses,
        savings,
        investments,
        total_assets,
        total_liabilities,
        existing_emi,
        expenses = [],
        assets = []
    } = profile;

    // Core metrics
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0) + Number(existing_emi || 0);
    const totalSavings = Number(savings || 0) + assets.reduce((sum, a) => sum + Number(a.value), 0);
    
    let emergency_months = totalExpenses > 0 ? totalSavings / totalExpenses : 0;
    if (!totalSavings || totalSavings === 0) {
        emergency_months = 0;
    }

    const debt_to_income = monthly_income > 0 ? (existing_emi / monthly_income) : 1;

    const savings_rate = monthly_income > 0
        ? (monthly_income - monthly_expenses - existing_emi) / monthly_income
        : 0;

    const net_worth = (total_assets || 0) - (total_liabilities || 0);

    // Component scores (0–100)
    const emergencyFundScore = Math.min(emergency_months / 6, 1) * 100;
    const debtScore = Math.max(1 - debt_to_income, 0) * 100;
    const savingsScore = Math.min(Math.max(savings_rate, 0) / 0.25, 1) * 100;

    // Composite: 40% emergency + 30% debt + 30% savings
    const financial_health_score = Math.round(
        0.4 * emergencyFundScore + 0.3 * debtScore + 0.3 * savingsScore
    );

    const risk = riskLevel(financial_health_score);

    // Radar chart data strictly formatted per requirements
    const radar_data = [
        { subject: 'Savings Strength', value: Math.round(savingsScore) },
        { subject: 'Debt Burden',      value: Math.round(debtScore) },
        { subject: 'Emergency Buffer', value: Math.round(emergencyFundScore) },
        { subject: 'Income Stability', value: 80 },
        { subject: 'Net Worth Growth', value: 70 },
    ];

    // Asset allocation for pie chart
    const asset_allocation = [
        { name: 'Savings',      value: savings || 0 },
        { name: 'Investments',  value: investments || 0 },
        { name: 'Other Assets', value: Math.max((total_assets || 0) - (savings || 0) - (investments || 0), 0) },
    ].filter((a) => a.value > 0);

    return {
        net_worth,
        savings_rate: parseFloat(savings_rate.toFixed(3)),
        emergency_months: parseFloat(emergency_months.toFixed(1)),
        debt_to_income: parseFloat(debt_to_income.toFixed(3)),
        financial_health_score,
        risk_level: risk,
        emergency_fund_score: Math.round(emergencyFundScore),
        debt_score: Math.round(debtScore),
        savings_score: Math.round(savingsScore),
        radar_data,
        asset_allocation,
    };
}

module.exports = { analyzeResilience };
