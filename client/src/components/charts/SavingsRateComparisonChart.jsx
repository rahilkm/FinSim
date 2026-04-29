import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LabelList } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const color = label === 'Before' ? '#f97316' : '#ef4444';
        return (
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-4 rounded-2xl shadow-2xl flex flex-col gap-1 min-w-[130px] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: color }} />
                <p className="text-[10px] font-extrabold text-[var(--color-text-muted)] uppercase tracking-widest">{label}</p>
                <p className="text-xl font-black text-[var(--color-text)] tracking-tight">{payload[0].value}%</p>
                <p className="text-xs text-[var(--color-text-secondary)] font-bold">Savings Rate</p>
            </div>
        );
    }
    return null;
};

export default function SavingsRateComparisonChart({ rateBefore, rateAfter }) {
    let before = parseFloat((rateBefore * 100).toFixed(1));
    let after  = parseFloat((rateAfter  * 100).toFixed(1));

    before = Math.max(0, Math.min(100, before));
    after  = Math.max(0, Math.min(100, after));

    const data = [
        { name: 'Before', rate: before, fill: 'url(#srGradBefore)', strokeColor: '#f97316' },
        { name: 'After',  rate: after,  fill: after > 0 ? 'url(#srGradAfter)' : 'url(#srGradZero)', strokeColor: '#ef4444', isZero: after === 0 },
    ];

    return (
        <div className="glass-panel glow-panel rounded-3xl p-8 relative overflow-hidden">
            <h3 className="text-xl font-black text-[var(--color-text)] mb-2 tracking-tight">Savings Rate Comparison</h3>
            <p className="text-xs text-[var(--color-text-secondary)] mb-8 font-medium">How this decision affects your ability to save</p>

            <ResponsiveContainer width="100%" height={240}>
                <BarChart data={data} barCategoryGap="25%" margin={{ top: 35, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="srGradBefore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#f97316" stopOpacity={1} />
                            <stop offset="95%" stopColor="#c2410c" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="srGradAfter" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#ef4444" stopOpacity={1} />
                            <stop offset="95%" stopColor="#b91c1c" stopOpacity={0.7} />
                        </linearGradient>
                        <linearGradient id="srGradZero" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#6b7280" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#374151" stopOpacity={0.4} />
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
                        unit="%"
                        stroke="var(--color-text-muted)"
                        tick={{ fontSize: 11, fill: 'var(--color-text-muted)', fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                        domain={[0, 100]}
                    />

                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-surface-hover)', opacity: 0.5, rx: 12 }} />

                    <Bar dataKey="rate" radius={[8, 8, 8, 8]} maxBarSize={60} minPointSize={6}>
                        {data.map((entry, index) => (
                            <Cell key={index} fill={entry.fill} />
                        ))}
                        <LabelList
                            dataKey="rate"
                            position="top"
                            formatter={(val, entry) => {
                                const item = data.find(d => d.rate === val);
                                if (item?.isZero) return 'N/A';
                                return val > 0 ? `${val}%` : '';
                            }}
                            style={{ fill: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 800 }}
                            offset={12}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
