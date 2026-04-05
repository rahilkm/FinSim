import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function HealthRadarChart({ data = [] }) {
    if (!data.length) return null;

    return (
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data} margin={{ top: 32, right: 32, bottom: 32, left: 32 }}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
                <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 11, fill: 'var(--color-text-muted)', fontWeight: 600 }}
                />
                <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#22d3ee"
                    fill="#22d3ee"
                    fillOpacity={0.2}
                    strokeWidth={2}
                />
            </RadarChart>
        </ResponsiveContainer>
    );
}
