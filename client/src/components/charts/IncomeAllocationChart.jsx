import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-border)] p-4 rounded-2xl shadow-2xl flex flex-col gap-1 min-w-[150px] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: payload[0].payload.strokeColor }} />
                <p className="text-[10px] font-extrabold text-[var(--color-text-muted)] uppercase tracking-widest">{label}</p>
                <p className="text-xl font-black text-[var(--color-text)] tracking-tight">
                    {formatCurrency(payload[0].value)}
                </p>
            </div>
        );
    }
    return null;
};

export default function IncomeAllocationChart({ expenses, emi, savings }) {
    const clampedSavings  = Math.max(savings,  0);
    const clampedEmi      = Math.max(emi,      0);
    const clampedExpenses = Math.max(expenses, 0);

    const data = [
        { name: 'EMI',      amount: clampedEmi,      fill: 'url(#allocEMI)',      strokeColor: '#8b5cf6' },
        { name: 'Expenses', amount: clampedExpenses,  fill: 'url(#allocExpenses)', strokeColor: '#6b7280' },
        { name: 'Savings',  amount: clampedSavings,   fill: 'url(#allocSavings)',  strokeColor: '#22d3ee' },
    ];

    return (
        <div className="glass-panel glow-panel p-6 rounded-2xl relative overflow-hidden">
            <h3 className="text-base font-bold text-[var(--color-text)] mb-1">Income Allocation After Decision</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">How your income is distributed after taking this loan</p>

            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data} barCategoryGap="25%" margin={{ top: 35, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="allocEMI" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={1} />
                            <stop offset="95%" stopColor="#6d28d9" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="allocExpenses" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#6b7280" stopOpacity={1} />
                            <stop offset="95%" stopColor="#374151" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="allocSavings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#22d3ee" stopOpacity={1} />
                            <stop offset="95%" stopColor="#0891b2" stopOpacity={0.7} />
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
                        tickFormatter={(v) => v === 0 ? '0' : `₹${(v / 1000).toFixed(0)}k`}
                        axisLine={false}
                        tickLine={false}
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface-hover)', opacity: 0.5, rx: 12 }} />

                    <Bar dataKey="amount" radius={[8, 8, 8, 8]} maxBarSize={60}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                        <LabelList
                            dataKey="amount"
                            position="top"
                            formatter={(val) => val > 0 ? `₹${(val / 1000).toFixed(0)}k` : ''}
                            style={{ fill: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 800 }}
                            offset={12}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
