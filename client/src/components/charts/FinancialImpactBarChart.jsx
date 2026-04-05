import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const order = ['Before', 'After'];
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
                <p style={{ fontWeight: 'bold', marginBottom: '8px', color: '#ffffff' }}>{label}</p>
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

export default function FinancialImpactBarChart({ savingsBefore, savingsAfter, investmentsBefore, investmentsAfter, netWorthBefore, netWorthAfter }) {
    const data = [
        { 
            name: 'Savings', 
            Before: Math.max(savingsBefore, 0), 
            After: Math.max(savingsAfter, 0) 
        },
        { 
            name: 'Investments', 
            Before: Math.max(investmentsBefore, 0), 
            After: Math.max(investmentsAfter, 0) 
        },
        { 
            name: 'Net Worth', 
            Before: Math.max(netWorthBefore, 0), 
            After: Math.max(netWorthAfter, 0) 
        },
    ];

    return (
        <div className="glass-panel glow-panel rounded-2xl w-full" style={{ padding: '16px 20px', overflow: 'visible' }}>
            <h3 className="text-base font-bold text-[var(--color-text)] mb-1">Financial Impact Breakdown</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">Savings, Investments, and Net Worth before vs. after the shock</p>
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#e5e7eb', fontSize: 13, fontWeight: 600 }} 
                        axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} 
                        tickLine={false} 
                    />
                    <YAxis 
                        tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} 
                        tick={{ fill: '#9ca3af', fontSize: 12 }} 
                        axisLine={false} 
                        tickLine={false} 
                    />
                    <Tooltip 
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Legend 
                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px', fontWeight: 500, color: '#e5e7eb' }} 
                        iconType="circle" 
                    />
                    <Bar dataKey="Before" fill="#22d3ee" radius={[6, 6, 0, 0]} maxBarSize={60} activeBar={{ filter: 'brightness(1.2)' }} />
                    <Bar dataKey="After" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={60} activeBar={{ filter: 'brightness(1.2)' }} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
