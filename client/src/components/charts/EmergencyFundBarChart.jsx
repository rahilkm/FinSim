import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

export default function EmergencyFundBarChart({ monthsBefore, monthsAfter }) {
    const data = [
        { name: 'Before Shock', months: +monthsBefore.toFixed(1) },
        { name: 'After Shock', months: +monthsAfter.toFixed(1) },
    ];

    const getColor = (months) => {
        if (months < 3) return '#ef4444';
        if (months < 6) return '#f59e0b';
        return '#22d3ee';
    };

    return (
        <div className="glass-panel glow-panel p-6 rounded-2xl">
            <h3 className="text-base font-bold text-[var(--color-text)] mb-1">Emergency Fund Coverage</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-4">Months of expenses covered before and after shock</p>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart
                    layout="vertical"
                    data={data}
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }} unit=" mo" />
                    <YAxis type="category" dataKey="name" tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} width={90} />
                    <Tooltip
                        formatter={(v) => [`${v} months`, 'Emergency Coverage']}
                        contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px' }}
                        labelStyle={{ color: 'var(--color-text)' }}
                    />
                    <Bar dataKey="months" radius={[0, 8, 8, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={index} fill={getColor(entry.months)} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
