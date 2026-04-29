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
    // Emergency fund: full score at 6+ months of expenses
    const emergencyFundScore = Math.min(emergency_months / 6, 1) * 100;

    // Debt score: 0% DTI = 100, 50%+ DTI = 0
    const debtScore = Math.max(1 - debt_to_income, 0) * 100;

    // Savings score: 25%+ savings rate = 100
    const savingsScore = Math.min(Math.max(savings_rate, 0) / 0.25, 1) * 100;

    // Net worth score: negative net worth is penalised
    // Positive: scaled against 12× monthly income (a healthy benchmark)
    // Negative: capped at 0, with penalty proportional to how negative it is
    let netWorthScore;
    if (net_worth >= 0) {
        const benchmark = (monthly_income || 1) * 12;
        netWorthScore = Math.min(net_worth / benchmark, 1) * 100;
    } else {
        // Negative net worth: penalty — deeper the hole, lower the score
        const maxPenaltyDepth = (monthly_income || 1) * 12;
        netWorthScore = Math.max(0, (1 - Math.abs(net_worth) / maxPenaltyDepth)) * 50; // capped at 50 when deeply negative
    }

    // Income stability: based on expense-to-income ratio (lower is better)
    const expenseRatio = monthly_income > 0 ? totalExpenses / monthly_income : 1;
    const incomeStabilityScore = Math.max(1 - expenseRatio, 0) * 100;

    // Composite: 30% emergency + 25% debt + 25% savings + 15% net worth + 5% income stability
    const financial_health_score = Math.round(
        0.30 * emergencyFundScore +
        0.25 * debtScore +
        0.25 * savingsScore +
        0.15 * netWorthScore +
        0.05 * incomeStabilityScore
    );

    const risk = riskLevel(financial_health_score);

    // Radar chart data — all real computed values
    const radar_data = [
        { subject: 'Savings Strength',  value: Math.round(savingsScore) },
        { subject: 'Debt Burden',       value: Math.round(debtScore) },
        { subject: 'Emergency Buffer',  value: Math.round(emergencyFundScore) },
        { subject: 'Income Stability',  value: Math.round(incomeStabilityScore) },
        { subject: 'Net Worth Growth',  value: Math.round(netWorthScore) },
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
        net_worth_score: Math.round(netWorthScore),
        income_stability_score: Math.round(incomeStabilityScore),
        radar_data,
        asset_allocation,
    };
}

module.exports = { analyzeResilience };
