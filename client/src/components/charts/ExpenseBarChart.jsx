import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

export default function ExpenseBarChart({ income = 0, expenses = 0, emi = 0 }) {
    const data = [
        { name: 'Income', amount: income, color: '#22c55e' },
        { name: 'Expenses', amount: expenses, color: '#ef4444' },
        { name: 'EMI', amount: emi, color: '#3b82f6' },
        { name: 'Savings', amount: Math.max(0, income - expenses - emi), color: '#06b6d4' },
    ];

    return (
        <div className="glass-panel glow-panel rounded-2xl p-6">
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-6">Expense vs Income</h3>
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data} barCategoryGap="20%">
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                        tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
                        axisLine={{ stroke: '#94a3b8' }}
                        tickLine={false}
                    />
                    <YAxis
                        stroke="#94a3b8"
                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        formatter={(v) => [formatCurrency(v)]}
                        contentStyle={{
                            backgroundColor: '#0f172a',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px',
                            color: '#e2e8f0',
                        }}
                        labelStyle={{ color: '#94a3b8' }}
                        itemStyle={{ color: '#e2e8f0' }}
                        wrapperStyle={{ zIndex: 1000 }}
                    />
                    <Bar dataKey="amount" radius={[6, 6, 0, 0]} background={false}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
