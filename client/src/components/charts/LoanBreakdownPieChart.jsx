import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const COLORS = ['#8b5cf6', '#ef4444'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
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
                {payload.map((entry, index) => {
                    const dotColor = entry.payload?.fill || entry.color || (entry.name === 'Principal' ? '#8b5cf6' : '#ef4444');
                    return (
                        <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', padding: '2px 0' }}>
                            <span style={{
                                display: 'inline-block',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: dotColor,
                                marginRight: '8px'
                            }}></span>
                            <span style={{ color: '#ffffff', marginRight: '4px' }}>{entry.name}:</span>
                            <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{formatCurrency(entry.value)}</span>
                        </div>
                    );
                })}
            </div>
        );
    }
    return null;
};

export default function LoanBreakdownPieChart({ principal, totalInterest }) {
    const data = [
        { name: 'Principal', value: principal },
        { name: 'Interest', value: totalInterest },
    ];

    return (
        <div className="glass-panel glow-panel p-6 rounded-2xl">
            <h3 className="text-base font-bold text-[var(--color-text)] mb-1">Loan Cost Breakdown</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">Principal vs. total interest paid over loan tenure</p>
            <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={85}
                        dataKey="value"
                        labelLine={false}
                    >
                        {data.map((_, index) => (
                            <Cell key={index} fill={COLORS[index]} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
