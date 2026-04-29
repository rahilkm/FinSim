import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const BASE_COLORS = ["#22d3ee", "#8b5cf6", "#f59e0b", "#ef4444"];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[var(--color-surface)]/95 backdrop-blur-md border border-[var(--color-border)] px-4 py-3 rounded-2xl shadow-xl flex flex-col gap-0.5 min-w-[140px] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1" style={{ background: BASE_COLORS[payload[0].payload.index % BASE_COLORS.length] }} />
                <p className="text-[10px] font-extrabold text-[var(--color-text-muted)] uppercase tracking-widest">{payload[0].name}</p>
                <p className="text-lg font-black text-[var(--color-text)] tracking-tight">
                    {formatCurrency(payload[0].value)}
                </p>
                <p className="text-[11px] text-[var(--color-text-secondary)] font-bold">
                    {payload[0].payload.percentStr}% of Portfolio
                </p>
            </div>
        );
    }
    return null;
};

export default function AssetPieChart({ assets = [] }) {
    if (!assets || !assets.length) return null;

    const total = assets.reduce((s, a) => s + Number(a.value), 0);

    const chartData = assets.map((a, index) => ({
        name: a.name,
        value: Number(a.value),
        index: index,
        percentStr: total > 0 ? ((Number(a.value) / total) * 100).toFixed(1) : '0.0'
    }));

    return (
        <div className="glass-panel glow-panel rounded-3xl p-8 h-full flex flex-col">
            <h3 className="text-xl font-black text-[var(--color-text)] mb-2 tracking-tight">Asset Allocation</h3>
            <p className="text-xs text-[var(--color-text-secondary)] mb-8 font-medium">Distribution of your individual assets</p>
            
            <div className="flex flex-col xl:flex-row items-center justify-center gap-10 flex-1">
                <div className="w-[200px] h-[200px] shrink-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <defs>
                                <linearGradient id="pieGrad0" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={1} />
                                    <stop offset="95%" stopColor="#0891b2" stopOpacity={0.8} />
                                </linearGradient>
                                <linearGradient id="pieGrad1" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={1} />
                                    <stop offset="95%" stopColor="#6d28d9" stopOpacity={0.8} />
                                </linearGradient>
                                <linearGradient id="pieGrad2" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={1} />
                                    <stop offset="95%" stopColor="#b45309" stopOpacity={0.8} />
                                </linearGradient>
                                <linearGradient id="pieGrad3" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={1} />
                                    <stop offset="95%" stopColor="#b91c1c" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                            
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={90}
                                stroke="var(--color-surface)"
                                strokeWidth={3}
                                paddingAngle={2}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={index} fill={`url(#pieGrad${index % 4})`} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                        </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Inner glowing effect ring */}
                    <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />
                </div>
                
                <div className="space-y-5 w-full xl:w-auto flex-1 text-sm">
                    {chartData.map((entry, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-surface-hover)] transition-colors">
                            <span className="flex items-center gap-3 font-bold text-[var(--color-text-secondary)]">
                                <span className="w-3.5 h-3.5 rounded-full shadow-md" style={{ background: BASE_COLORS[i % BASE_COLORS.length] }} />
                                {entry.name}
                            </span>
                            <div className="text-right flex items-center gap-4">
                                <span className="font-black text-[var(--color-text)] tracking-tight text-base">{formatCurrency(entry.value)}</span>
                                <span className="text-[var(--color-text-muted)] text-xs font-bold w-12 text-right bg-[var(--color-surface)] px-2 py-1 rounded-md">
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
