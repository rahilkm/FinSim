import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const COLORS     = ['#8b5cf6', '#ef4444'];
const GRAD_IDS   = ['loanPieGrad0', 'loanPieGrad1'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const color = COLORS[payload[0].payload.index];
        return (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] px-4 py-3 rounded-2xl shadow-xl flex flex-col gap-0.5 min-w-[140px] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: color }} />
                <p className="text-[10px] font-extrabold text-[var(--color-text-muted)] uppercase tracking-widest">{payload[0].name}</p>
                <p className="text-lg font-black text-[var(--color-text)] tracking-tight">{formatCurrency(payload[0].value)}</p>
                <p className="text-[11px] text-[var(--color-text-secondary)] font-bold">
                    {payload[0].payload.percentStr}% of Total
                </p>
            </div>
        );
    }
    return null;
};

export default function LoanBreakdownPieChart({ principal, totalInterest }) {
    const total = principal + totalInterest;
    const data = [
        { name: 'Principal', value: principal,     index: 0, percentStr: total > 0 ? ((principal     / total) * 100).toFixed(1) : '0' },
        { name: 'Interest',  value: totalInterest, index: 1, percentStr: total > 0 ? ((totalInterest / total) * 100).toFixed(1) : '0' },
    ];

    return (
        <div className="glass-panel glow-panel rounded-3xl p-8 h-full flex flex-col">
            <h3 className="text-xl font-black text-[var(--color-text)] mb-2 tracking-tight">Loan Cost Breakdown</h3>
            <p className="text-xs text-[var(--color-text-secondary)] mb-8 font-medium">Principal vs. total interest paid over loan tenure</p>

            <div className="flex flex-col items-center gap-6 flex-1">
                <div className="w-[160px] h-[160px] shrink-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <defs>
                                <linearGradient id="loanPieGrad0" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={1} />
                                    <stop offset="95%" stopColor="#6d28d9" stopOpacity={0.8} />
                                </linearGradient>
                                <linearGradient id="loanPieGrad1" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="5%"  stopColor="#ef4444" stopOpacity={1} />
                                    <stop offset="95%" stopColor="#b91c1c" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={32}
                                outerRadius={68}
                                stroke="var(--color-surface)"
                                strokeWidth={3}
                                paddingAngle={2}
                            >
                                {data.map((_, index) => (
                                    <Cell key={index} fill={`url(#${GRAD_IDS[index]})`} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />
                </div>

                <div className="w-full space-y-3 text-sm">
                    {data.map((entry, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 px-2 py-2 rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors">
                            <span className="flex items-center gap-2 font-bold text-[var(--color-text-secondary)] shrink-0">
                                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                                {entry.name}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="font-black text-[var(--color-text)] tracking-tight">{formatCurrency(entry.value)}</span>
                                <span className="text-[var(--color-text-muted)] text-xs font-bold bg-[var(--color-surface)] px-1.5 py-0.5 rounded-md whitespace-nowrap">
                                    {entry.percentStr}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
