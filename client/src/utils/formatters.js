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
