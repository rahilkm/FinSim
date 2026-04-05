/**
 * Shared financial math utilities used across all simulation modules.
 */

/**
 * Calculate EMI (Equated Monthly Installment).
 * EMI = P × r × (1+r)^n / ((1+r)^n − 1)
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (e.g., 0.09 for 9%)
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {number} EMI amount
 */
function calculateEMI(principal, annualRate, tenureMonths) {
    if (principal <= 0 || tenureMonths <= 0) return 0;
    if (annualRate === 0) return principal / tenureMonths;

    const r = annualRate / 12;
    const factor = Math.pow(1 + r, tenureMonths);
    return (principal * r * factor) / (factor - 1);
}

/**
 * Compound growth: P × (1 + rate)^periods
 */
function compoundGrowth(principal, rate, periods) {
    return principal * Math.pow(1 + rate, periods);
}

/**
 * Emergency fund months = savings / monthly_expenses
 */
function emergencyFundMonths(savings, monthlyExpenses) {
    if (monthlyExpenses <= 0) return Infinity;
    return savings / monthlyExpenses;
}

/**
 * Debt-to-Income ratio = total_emi / monthly_income
 */
function debtToIncomeRatio(totalEMI, monthlyIncome) {
    if (monthlyIncome <= 0) return Infinity;
    return totalEMI / monthlyIncome;
}

/**
 * Savings rate = (income - expenses) / income
 */
function savingsRate(monthlyIncome, monthlyExpenses) {
    if (monthlyIncome <= 0) return 0;
    return (monthlyIncome - monthlyExpenses) / monthlyIncome;
}

/**
 * Net worth = assets - liabilities
 */
function netWorth(assets, liabilities) {
    return assets - liabilities;
}

/**
 * Classify risk level from a financial health score (0–100).
 */
function riskLevel(score) {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Stable';
    if (score >= 40) return 'Risk';
    return 'Critical';
}

module.exports = {
    calculateEMI,
    compoundGrowth,
    emergencyFundMonths,
    debtToIncomeRatio,
    savingsRate,
    netWorth,
    riskLevel,
};
