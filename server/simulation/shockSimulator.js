const { riskLevel } = require('../utils/financialMath');

function simulateShock(profile, params) {
    const {
        monthly_income = 0,
        monthly_expenses = 0,
        savings = 0,
        investments = 0,
        total_assets = 0,
        total_liabilities = 0,
        existing_emi = 0
    } = profile;

    const {
        shock_duration_months = 1,
        income_loss_percent = 0,
        unexpected_expense = 0,
        market_drop_percent = 0,
    } = params;

    // ── SOURCE OF TRUTH FORMULAS ─────────────────────────────────────────────
    const new_income = monthly_income * (1 - income_loss_percent);
    const new_expenses = monthly_expenses + unexpected_expense;

    const monthly_net = new_income - new_expenses;
    const remaining_savings_raw = savings + (monthly_net * shock_duration_months);
    const remaining_savings = Math.max(0, remaining_savings_raw);

    const new_investments = investments * (1 - market_drop_percent);

    const emergency_months_before = monthly_expenses > 0 ? (savings / monthly_expenses) : 0;
    const emergency_months_after = monthly_expenses > 0 ? (remaining_savings / monthly_expenses) : 0;

    // Assets updating dynamically from the shock impacts
    const new_assets = (total_assets - savings - investments) + remaining_savings + new_investments;

    const netWorthBefore = total_assets - total_liabilities;
    const netWorthAfter = new_assets - total_liabilities;

    // ── Fix Savings Projection Graph ─────────────────────────────────────────
    const savings_timeline = [];
    const savings_projection = [];

    for (let n = 0; n <= shock_duration_months; n++) {
        const sn = Math.max(0, savings + (monthly_net * n));
        savings_projection.push(Math.round(sn));
        savings_timeline.push({ month: n, savings: Math.round(sn) });
    }

    // ── Fix Risk Level ───────────────────────────────────────────────────────
    let risk = 'STABLE';
    if (emergency_months_after < 3) risk = 'CRITICAL';
    else if (emergency_months_after >= 3 && emergency_months_after < 6) risk = 'HIGH';

    // ── Metrics for Recommendation Engine ─────────────────────────────────────
    const savingsRate = monthly_income > 0 ? ((monthly_income - monthly_expenses - existing_emi) / monthly_income) * 100 : 0;
    const dti = monthly_income > 0 ? (existing_emi / monthly_income) * 100 : 0;

    return {
        simulation_type: 'shock',

        // Core outputs
        updated_income: Math.round(new_income),
        updated_expenses: Math.round(new_expenses),
        remaining_savings: Math.round(remaining_savings),
        new_investments: Math.round(new_investments),

        // Net worth
        current_net_worth: Math.round(netWorthBefore),
        new_net_worth: Math.round(netWorthAfter),
        net_worth_before: Math.round(netWorthBefore),
        net_worth_after: Math.round(netWorthAfter),

        // Emergency fund (before/after aliases mapped identically)
        emergency_fund_before: parseFloat(Math.max(emergency_months_before, 0).toFixed(1)),
        emergency_fund_after: parseFloat(Math.max(emergency_months_after, 0).toFixed(1)),
        emergency_months_before: parseFloat(Math.max(emergency_months_before, 0).toFixed(1)),
        emergency_months_after: parseFloat(Math.max(emergency_months_after, 0).toFixed(1)),

        // Months Survivable baseline
        months_survivable: parseFloat(Math.max(emergency_months_before, 0).toFixed(1)),

        // Risk level 
        risk_level: risk,

        // For recommendation engine strictly passing PRD metrics
        emergency_months_before_shock: emergency_months_before,
        emergency_months_after_shock: emergency_months_after,
        savings_rate_percent: savingsRate,
        dti_percent: dti,

        // Base inputs for Conditional Logic tracking
        savings_baseline: savings,
        investments_baseline: investments,
        income_loss_percent: income_loss_percent,
        unexpected_expense: unexpected_expense,
        market_drop_percent: market_drop_percent,

        // Chart data 
        savings_projection,
        savings_timeline,
    };
}

module.exports = { simulateShock };
