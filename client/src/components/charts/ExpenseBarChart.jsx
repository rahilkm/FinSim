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

export default function ExpenseBarChart({ income = 0, expenses = 0, emi = 0 }) {
    const data = [
        { name: 'Income', amount: income, fill: 'url(#colorIncome)', strokeColor: '#10b981' },
        { name: 'Expenses', amount: expenses, fill: 'url(#colorExpenses)', strokeColor: '#ef4444' },
        { name: 'EMI', amount: emi, fill: 'url(#colorEMI)', strokeColor: '#3b82f6' },
        { name: 'Savings', amount: Math.max(0, income - expenses - emi), fill: 'url(#colorSavings)', strokeColor: '#06b6d4' },
    ];

    return (
        <div className="glass-panel glow-panel rounded-3xl p-8 relative overflow-hidden">
            <h3 className="text-xl font-black text-[var(--color-text)] mb-8 flex items-center gap-2 tracking-tight">
                Expense vs Income
            </h3>
            
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} barCategoryGap="25%" margin={{ top: 35, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={1} />
                            <stop offset="95%" stopColor="#047857" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={1} />
                            <stop offset="95%" stopColor="#b91c1c" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="colorEMI" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={1} />
                            <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={1} />
                            <stop offset="95%" stopColor="#0e7490" stopOpacity={0.7} />
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
