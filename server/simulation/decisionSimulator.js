const { calculateEMI, debtToIncomeRatio, netWorth, riskLevel } = require('../utils/financialMath');

/**
 * Simulate the financial impact of a major purchase/loan decision.
 * Per finsim_prd.txt — interest_rate is received as a percentage (e.g. 9.0)
 * and converted to decimal internally.
 */
function simulateDecision(profile, params) {
    const {
        monthly_income,
        monthly_expenses,
        total_assets,
        total_liabilities,
        existing_emi,
    } = profile;

    const { purchase_cost, down_payment, loan_tenure_months } = params;

    // interest_rate arrives as percent (e.g. 9.0) — convert to decimal
    const interest_rate = (params.interest_rate || 0) / 100;

    // Loan amount
    const loan_amount = purchase_cost - down_payment;

    // EMI calculation — tenure=0 means full cash purchase (no loan)
    const new_emi = loan_tenure_months > 0 ? calculateEMI(loan_amount, interest_rate, loan_tenure_months) : 0;

    // Total interest paid
    const total_interest = loan_tenure_months > 0 ? Math.max((new_emi * loan_tenure_months) - loan_amount, 0) : 0;

    // Updated burden
    const total_emi = existing_emi + new_emi;

    // Disposable income before/after
    const disposable_income_before = monthly_income - monthly_expenses - existing_emi;
    const disposable_income_after = monthly_income - monthly_expenses - total_emi;

    // Savings rate before/after  (per spec: (income - expenses - emi) / income)
    const savings_rate_before = monthly_income > 0
        ? (monthly_income - monthly_expenses - existing_emi) / monthly_income
        : 0;
    const savings_rate_after = monthly_income > 0
        ? (monthly_income - monthly_expenses - total_emi) / monthly_income
        : 0;

    // Debt ratio before/after
    const debt_ratio_before = debtToIncomeRatio(existing_emi, monthly_income);
    const debt_ratio_after = debtToIncomeRatio(total_emi, monthly_income);

    // Net worth before/after per spec: new_net_worth = (total_assets + purchase_cost) - total_liabilities
    const net_worth_before = total_assets - total_liabilities;
    const new_net_worth = (total_assets + purchase_cost) - total_liabilities;
    const net_worth_after = new_net_worth;

    // Financial stress level
    const stressScore = Math.max(1 - debt_ratio_after, 0) * 100;
    const financial_stress_level = riskLevel(stressScore);

    // Final Decision Engine
    let decision_label = 'SAFE';
    const dti_percent = debt_ratio_after * 100;
    if (dti_percent >= 50) decision_label = 'CRITICAL';
    else if (dti_percent >= 40) decision_label = 'RISKY';
    else if (dti_percent >= 30) decision_label = 'MODERATE';

    // Amortization timeline (for charts — first 12 months + milestones)
    const emi_timeline = [];
    let remaining_principal = loan_amount;
    const monthlyRate = interest_rate / 12;

    for (let m = 1; m <= Math.min(loan_tenure_months, 360); m++) {
        const interest_component = remaining_principal * monthlyRate;
        const principal_component = new_emi - interest_component;
        remaining_principal = Math.max(remaining_principal - principal_component, 0);

        if (m <= 12 || m % 12 === 0 || m === loan_tenure_months) {
            emi_timeline.push({
                month: m,
                principal: Math.round(principal_component),
                interest: Math.round(interest_component),
                balance: Math.round(remaining_principal),
            });
        }
    }

    return {
        simulation_type: 'decision',
        decision_label,
        loan_tenure_months,
        loan_amount: Math.round(loan_amount),
        emi: Math.round(new_emi),
        total_interest: Math.round(total_interest),
        total_repayment: Math.round(new_emi * loan_tenure_months),
        total_emi: Math.round(total_emi),

        disposable_income_before: Math.round(disposable_income_before),
        disposable_income_after: Math.round(disposable_income_after),
        // backward-compat alias
        disposable_income: Math.round(disposable_income_after),

        savings_rate_before: parseFloat(savings_rate_before.toFixed(3)),
        savings_rate_after: parseFloat(savings_rate_after.toFixed(3)),

        debt_ratio_before: parseFloat(debt_ratio_before.toFixed(3)),
        debt_ratio_after: parseFloat(debt_ratio_after.toFixed(3)),
        // alias used by recommendation engine
        debt_to_income: parseFloat(debt_ratio_after.toFixed(3)),

        net_worth_before: Math.round(net_worth_before),
        net_worth_after: Math.round(net_worth_after),
        new_net_worth: Math.round(new_net_worth),

        financial_stress_level,
        emi_timeline,

        // For recommendation engine
        monthly_income,
        savings_rate: parseFloat(savings_rate_after.toFixed(3)),
    };
}

module.exports = { simulateDecision };
