import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

/**
 * Smart Y-axis tick formatter — avoids "₹0k" when values are small.
 * Uses ₹k for values >= 1000, plain ₹ for smaller.
 */
function yAxisTick(v) {
    if (v >= 100000) return `₹${(v / 100000).toFixed(0)}L`;
    if (v >= 1000)   return `₹${(v / 1000).toFixed(0)}k`;
    return `₹${v}`;
}

export default function SavingsLineChart({ data = [] }) {
    if (!data.length) return null;

    return (
        <div className="glass-panel glow-panel rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-[var(--color-text)]">Savings Decline Simulation</h3>
                    <p className="text-xs text-[var(--color-text-muted)]">Month-by-month savings erosion under current shock</p>
                </div>
                <div className="flex gap-3">
                    <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-primary)]" /> Simulated
                    </span>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={256}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis
                        dataKey="month"
                        tickFormatter={(m) => `Mo ${m}`}
                        tick={{ fontSize: 10, fill: 'var(--color-text-muted)', fontWeight: 700 }}
                        axisLine={{ stroke: 'var(--color-border)' }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
                        tickFormatter={yAxisTick}
                        axisLine={false}
                        tickLine={false}
                        width={60}
                    />
                    <Tooltip
                        formatter={(v) => [formatCurrency(v), 'Savings']}
                        labelFormatter={(m) => `Month ${m}`}
                        contentStyle={{
                            backgroundColor: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 12,
                            fontSize: 12,
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="savings"
                        stroke="#22d3ee"
                        strokeWidth={3}
                        fill="url(#savingsGradient)"
                        dot={{ r: 3, fill: '#22d3ee' }}
                        activeDot={{ r: 5 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
