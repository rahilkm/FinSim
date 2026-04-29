/**
 * Format number as Indian Rupee currency.
 */
export function formatCurrency(value) {
    if (value === null || value === undefined) return '₹0';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * Format decimal as percentage string.
 */
export function formatPercent(value, decimals = 1, cap = true) {
    if (value === null || value === undefined) return '0%';
    const percent = value * 100;
    
    if (cap) {
        if (percent > 100) return '> 100%';
        if (percent < -100) return '< -100%';
    }
    
    return `${percent.toFixed(decimals)}%`;
}

/**
 * Format a number with commas.
 */
export function formatNumber(value) {
    if (value === null || value === undefined) return '0';
    return new Intl.NumberFormat('en-IN').format(value);
}

/**
 * Format emergency fund duration.
 * < 1 month → shows as days (e.g. "~27 days")
 * >= 1 month → shows as months (e.g. "3.9 months" or "3.9 mo" if short=true)
 */
export function formatEmergencyMonths(months, short = false) {
    if (months === null || months === undefined) return short ? '0 mo' : '0 months';
    if (months < 1) {
        const days = Math.round(months * 30);
        return days <= 0 ? '0 days' : `~${days} days`;
    }
    const formatted = months.toFixed(1);
    return short ? `${formatted} mo` : `${formatted} months`;
}
