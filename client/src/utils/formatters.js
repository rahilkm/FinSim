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
export function formatPercent(value, decimals = 1) {
    if (value === null || value === undefined) return '0%';
    return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a number with commas.
 */
export function formatNumber(value) {
    if (value === null || value === undefined) return '0';
    return new Intl.NumberFormat('en-IN').format(value);
}
