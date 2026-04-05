/**
 * Rule-based recommendation engine.
 * Strictly outputs deterministic financial insights based on computed metrics.
 */

function generateRecommendations(metrics) {
    const recs = [];

    // ── Branch: Shock Simulator Recommendations ──
    if (metrics.simulation_type === 'shock') {
        const recs = [];

        // 1. SAVINGS IMPACT
        if (metrics.remaining_savings === 0) {
            recs.push({ text: 'Your savings will be fully depleted within the shock duration', type: 'savings' });
        } else if (metrics.remaining_savings < metrics.savings_baseline) {
            recs.push({ text: 'Your savings are projected to decline during this shock period', type: 'savings' });
        } else if (metrics.remaining_savings > metrics.savings_baseline) {
            recs.push({ text: 'Your savings continue to grow despite the shock due to positive cash flow', type: 'savings' });
        }

        // 2. EMERGENCY FUND IMPACT
        const em = metrics.emergency_months_after_shock;
        if (em < 3) {
            recs.push({ text: 'Your emergency fund falls below safe levels, indicating high financial vulnerability', type: 'savings' });
        } else if (em >= 3 && em < 6) {
            recs.push({ text: 'Your emergency buffer weakens and may not sustain prolonged shocks', type: 'savings' });
        } else if (em >= 6) {
            recs.push({ text: 'Your emergency fund remains strong despite the shock', type: 'savings' });
        }

        // 3. INCOME IMPACT
        if (metrics.income_loss_percent === 1) {
            recs.push({ text: 'Your income drops to zero during the shock period', type: 'expense' });
        } else if (metrics.income_loss_percent > 0) {
            recs.push({ text: 'Your income reduction significantly impacts your monthly cash flow', type: 'expense' });
        }

        // 4. EXPENSE IMPACT
        if (metrics.unexpected_expense > 0) {
            recs.push({ text: 'Unexpected expenses increase your financial burden during this period', type: 'expense' });
        }

        // 5. INVESTMENT IMPACT
        if (metrics.market_drop_percent > 0) {
            recs.push({ text: 'Your investments decline due to market conditions, reducing overall net worth', type: 'investment' });
        }

        // 6. NET WORTH IMPACT
        if (metrics.net_worth_after < 0) {
            recs.push({ text: 'Your net worth turns negative, indicating liabilities exceed assets', type: 'investment' }); // Note Investment type generally applies structurally
        } else if (metrics.net_worth_after < metrics.net_worth_before) {
            recs.push({ text: 'Your overall net worth declines due to combined effects of reduced assets', type: 'investment' });
        }

        return recs.slice(0, 6);
    }

    // ── Branch: Decision Simulator Recommendations ──
    if (metrics.simulation_type === 'decision') {
        const recs = [];
        const dti = (metrics.debt_to_income || 0) * 100;
        
        // 1. DEBT IMPACT
        if (dti >= 50) {
            recs.push({ text: 'Your debt burden becomes critically high, significantly increasing financial risk', type: 'debt' });
        } else if (dti >= 40) {
            recs.push({ text: 'Your debt burden rises to a high level, reducing financial flexibility', type: 'debt' });
        } else if (dti >= 30) {
            recs.push({ text: 'Your debt level increases but remains within manageable limits', type: 'debt' });
        } else {
            recs.push({ text: 'Your debt remains well within safe limits', type: 'debt' });
        }

        // 2. SAVINGS IMPACT
        if (metrics.savings_rate_after < metrics.savings_rate_before) {
            recs.push({ text: 'Your savings rate declines after taking this loan, reducing your ability to build reserves', type: 'savings' });
        } else {
            recs.push({ text: 'Your savings rate remains stable despite the loan', type: 'savings' });
        }

        // 3. CASH FLOW IMPACT
        const surplus = metrics.disposable_income_after;
        if (surplus < 0) {
            recs.push({ text: 'Your monthly cash flow turns negative, indicating the loan is not affordable', type: 'expense' });
        } else if (surplus < 10000) {
            recs.push({ text: 'Your remaining monthly surplus becomes tight, leaving limited room for unexpected expenses', type: 'expense' });
        } else {
            recs.push({ text: 'Your monthly surplus remains healthy after loan payments', type: 'expense' });
        }

        // 4. EMI BURDEN
        if (metrics.monthly_income > 0 && (metrics.emi / metrics.monthly_income) > 0.3) {
            recs.push({ text: 'A significant portion of your income is committed to loan repayment', type: 'expense' });
        }

        return recs.slice(0, 5);
    }

    // ── Branch: General / Resilience Overview ──
    // 1. Emergency Fund Rule
    if (metrics.emergency_months !== undefined) {
        const em = metrics.emergency_months;
        if (em < 3) {
            recs.push({ text: 'Your emergency fund covers less than 3 months of expenses. Increase savings immediately to build at least a 6-month buffer.', type: 'savings' });
        } else if (em >= 3 && em < 6) {
            recs.push({ text: 'Your emergency fund is moderate but vulnerable to long financial shocks. Aim to increase it to at least 6 months of coverage.', type: 'savings' });
        } else if (em >= 6 && em <= 12) {
            recs.push({ text: 'Your emergency fund provides good financial protection. Maintain this level of liquidity.', type: 'savings' });
        } else if (em > 12) {
            recs.push({ text: 'You have a very strong emergency reserve. Your liquidity position is highly resilient.', type: 'savings' });
        }
    }

    // 2. Savings Rate Rule
    if (metrics.savings_rate !== undefined) {
        const sr = metrics.savings_rate;
        if (sr < 0.1) {
            recs.push({ text: 'Your savings rate is very low. Consider reducing expenses or increasing income.', type: 'savings' });
        } else if (sr >= 0.1 && sr < 0.2) {
            recs.push({ text: 'Your savings rate is acceptable but could be improved.', type: 'savings' });
        } else if (sr >= 0.2 && sr < 0.35) {
            recs.push({ text: 'Your savings rate is strong and supports long-term growth.', type: 'savings' });
        } else if (sr >= 0.35) {
            recs.push({ text: 'Your savings rate is excellent and provides strong financial flexibility.', type: 'savings' });
        }
    }

    // 3. Debt-to-Income Rule
    if (metrics.debt_to_income !== undefined) {
        const dti = metrics.debt_to_income;
        if (dti > 0.5) {
            recs.push({ text: 'Your debt burden exceeds safe limits. Avoid additional loans and focus on reducing liabilities.', type: 'debt' });
        } else if (dti >= 0.4 && dti <= 0.5) {
            recs.push({ text: 'Your debt level is high and may create financial stress.', type: 'debt' });
        } else if (dti >= 0.3 && dti < 0.4) {
            recs.push({ text: 'Your debt level is manageable but should be monitored.', type: 'debt' });
        } else if (dti < 0.3) {
            recs.push({ text: 'Your debt level is within a safe range and unlikely to create financial strain.', type: 'debt' });
        }
    }

    return recs;
}

module.exports = { generateRecommendations };
