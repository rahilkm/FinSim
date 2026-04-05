import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const COLORS = {
    'Net Worth Before': '#a78bfa',
    'Net Worth After': '#f97316',
};

export default function NetWorthBarChart({ netWorthBefore, netWorthAfter }) {
    const data = [
        { name: 'Before Shock', value: Math.max(netWorthBefore, 0) },
        { name: 'After Shock', value: Math.max(netWorthAfter, 0) },
    ];

    return (
        <div className="glass-panel glow-panel p-6 rounded-2xl">
            <h3 className="text-base font-bold text-[var(--color-text)] mb-1">Net Worth Impact</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">Net worth before vs. after the financial shock</p>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
                    <Tooltip formatter={(v) => formatCurrency(v)} labelStyle={{ color: 'var(--color-text)' }} contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px' }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        <Cell fill="#64748b" />
                        <Cell fill={netWorthAfter < netWorthBefore ? '#ef4444' : '#22d3ee'} />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
