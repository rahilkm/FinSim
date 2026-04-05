import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const COLORS = ["#22d3ee", "#8b5cf6", "#f59e0b", "#ef4444"];

export default function AssetPieChart({ assets = [] }) {
    if (!assets || !assets.length) return null;

    const chartData = assets.map(a => ({
        name: a.name,
        value: Number(a.value)
    }));

    const total = chartData.reduce((s, d) => s + d.value, 0);

    return (
        <div className="glass-panel glow-panel rounded-2xl p-6 h-full flex flex-col">
            <h3 className="text-lg font-bold text-[var(--color-text)] mb-2">Asset Allocation</h3>
            <p className="text-xs text-[var(--color-text-muted)] mb-6">Distribution of your individual assets</p>
            <div className="flex flex-col xl:flex-row items-center justify-center gap-8 flex-1">
                <div className="w-[180px] h-[180px] shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                strokeWidth={0}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(v) => formatCurrency(v)}
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '8px',
                                    color: '#e2e8f0'
                                }}
                                labelStyle={{ color: '#94a3b8' }}
                                itemStyle={{ color: '#e2e8f0' }}
                                wrapperStyle={{ zIndex: 1000 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-4 w-full xl:w-auto flex-1 text-sm">
                    {chartData.map((entry, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <span className="flex items-center gap-2 font-medium text-[var(--color-text-secondary)]">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                {entry.name}
                            </span>
                            <div className="text-right flex items-center gap-3">
                                <span className="font-bold text-[var(--color-text)]">{formatCurrency(entry.value)}</span>
                                {total > 0 && (
                                    <span className="text-[var(--color-text-muted)] text-xs w-10 text-right">
                                        {((entry.value / total) * 100).toFixed(1)}%
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
