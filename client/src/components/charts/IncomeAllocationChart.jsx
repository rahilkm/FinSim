import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const order = ['EMI', 'Expenses', 'Savings'];
        const sortedPayload = [...payload].sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

        return (
            <div style={{
                backgroundColor: '#111827',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '12px',
                color: '#ffffff',
                fontSize: '13px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
                {sortedPayload.map((entry, index) => (
                    <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', padding: '3px 0' }}>
                        <span style={{
                            display: 'inline-block',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: entry.color,
                            marginRight: '8px'
                        }}></span>
                        <span style={{ color: '#ffffff', marginRight: '4px' }}>{entry.name}:</span>
                        <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{formatCurrency(entry.value)}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export default function IncomeAllocationChart({ expenses, emi, savings }) {
    const data = [
        {
            name: 'Monthly Allocation',
            'Expenses': expenses,
            'EMI': emi,
            'Savings': savings,
        },
    ];

    return (
        <div className="glass-panel glow-panel p-6 rounded-2xl" style={{ overflow: 'visible' }}>
            <h3 className="text-base font-bold text-[var(--color-text)] mb-1">Income Allocation After Decision</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">How your income is distributed after taking this loan</p>
            <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#e5e7eb', fontSize: 13 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} />
                    <YAxis tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{ fill: 'transparent' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', color: '#e5e7eb' }} />
                    <Bar dataKey="Expenses" stackId="a" fill="#6b7280" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="EMI" stackId="a" fill="#8b5cf6" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Savings" stackId="a" fill="#22d3ee" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
