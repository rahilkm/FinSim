import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

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
                    const itemName = entry.payload.name; 
                    const dotColor = itemName === 'Before' ? '#f97316' : '#ef4444';
                    
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
                            <span style={{ color: '#ffffff', marginRight: '4px' }}>{itemName}:</span>
                            <span style={{ color: '#ffffff', fontWeight: 'bold' }}>{entry.value}%</span>
                        </div>
                    );
                })}
            </div>
        );
    }
    return null;
};

export default function SavingsRateComparisonChart({ rateBefore, rateAfter }) {
    let before = parseFloat((rateBefore * 100).toFixed(1));
    let after = parseFloat((rateAfter * 100).toFixed(1));

    // Cap values between 0 and 100 so the chart only shows above the X-axis
    before = Math.max(0, Math.min(100, before));
    after = Math.max(0, Math.min(100, after));

    const data = [
        { name: 'Before', rate: before },
        { name: 'After', rate: after },
    ];

    const getColor = (name) => {
        return name === 'Before' ? '#f97316' : '#ef4444';
    };

    return (
        <div className="glass-panel glow-panel p-6 rounded-2xl">
            <h3 className="text-base font-bold text-[var(--color-text)] mb-1">Savings Rate Comparison</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">How this decision affects your ability to save</p>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                    <XAxis dataKey="name" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
                    <YAxis unit="%" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} content={<CustomTooltip />} />
                    <Bar dataKey="rate" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={index} fill={getColor(entry.name)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
