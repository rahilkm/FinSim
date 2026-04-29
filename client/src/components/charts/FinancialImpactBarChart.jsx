import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const order = ['Before', 'After'];
        const sortedPayload = [...payload].sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
        const accentColor = sortedPayload[0]?.name === 'Before' ? '#22d3ee' : '#ef4444';
        return (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl shadow-2xl flex flex-col gap-1 min-w-[160px] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #22d3ee, #ef4444)' }} />
                <p className="text-[10px] font-extrabold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">{label}</p>
                {sortedPayload.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.name === 'Before' ? '#22d3ee' : '#ef4444' }} />
                        <span className="text-[var(--color-text-secondary)] text-xs font-bold">{entry.name}:</span>
                        <span className="text-[var(--color-text)] text-sm font-black tracking-tight">{formatCurrency(entry.value)}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function FinancialImpactBarChart({ savingsBefore, savingsAfter, investmentsBefore, investmentsAfter, netWorthBefore, netWorthAfter }) {
    const data = [
        { name: 'Savings',     Before: Math.max(savingsBefore, 0),     After: Math.max(savingsAfter, 0) },
        { name: 'Investments', Before: Math.max(investmentsBefore, 0), After: Math.max(investmentsAfter, 0) },
        { name: 'Net Worth',   Before: Math.max(netWorthBefore, 0),    After: Math.max(netWorthAfter, 0) },
    ];

    return (
        <div className="glass-panel glow-panel rounded-3xl p-8 relative overflow-hidden">
            <h3 className="text-xl font-black text-[var(--color-text)] mb-1 tracking-tight">Financial Impact Breakdown</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-8">Savings, Investments, and Net Worth before vs. after the shock</p>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} barCategoryGap="25%" barGap={6} margin={{ top: 35, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="gradBefore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#22d3ee" stopOpacity={1} />
                            <stop offset="95%" stopColor="#0891b2" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="gradAfter" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#ef4444" stopOpacity={1} />
                            <stop offset="95%" stopColor="#b91c1c" stopOpacity={0.7} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" vertical={false} opacity={0.5} />

                    <XAxis
                        dataKey="name"
                        stroke="var(--color-text-muted)"
                        tick={{ fontSize: 12, fill: 'var(--color-text-secondary)', fontWeight: 700 }}
                        axisLine={false}
                        tickLine={false}
                        dy={10}
                    />

                    <YAxis
                        stroke="var(--color-text-muted)"
                        tick={{ fontSize: 11, fill: 'var(--color-text-muted)', fontWeight: 600 }}
                        tickFormatter={(v) => v === 0 ? '0' : `₹${(v / 100000).toFixed(1)}L`}
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface-hover)', opacity: 0.5, rx: 12 }} offset={60} />

                    <Legend
                        wrapperStyle={{ fontSize: '12px', paddingTop: '20px', fontWeight: 700, color: 'var(--color-text-secondary)' }}
                        iconType="circle"
                    />

                    <Bar dataKey="Before" fill="url(#gradBefore)" radius={[8, 8, 8, 8]} maxBarSize={50}>
                        <LabelList
                            dataKey="Before"
                            position="top"
                            formatter={(val) => val > 0 ? (val >= 100000 ? `₹${(val / 100000).toFixed(1)}L` : `₹${(val / 1000).toFixed(0)}k`) : ''}
                            style={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontWeight: 800 }}
                            offset={10}
                        />
                    </Bar>

                    <Bar dataKey="After" fill="url(#gradAfter)" radius={[8, 8, 8, 8]} maxBarSize={50}>
                        <LabelList
                            dataKey="After"
                            position="top"
                            formatter={(val) => val > 0 ? (val >= 100000 ? `₹${(val / 100000).toFixed(1)}L` : `₹${(val / 1000).toFixed(0)}k`) : ''}
                            style={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontWeight: 800 }}
                            offset={10}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
