import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

// Custom tick that wraps long labels onto 2 lines
const CustomTick = ({ x, y, payload, cx, cy }) => {
    const words = payload.value.split(' ');
    const midpoint = Math.ceil(words.length / 2);
    const line1 = words.slice(0, midpoint).join(' ');
    const line2 = words.slice(midpoint).join(' ');

    // Determine text-anchor based on position relative to center
    const dx = x - cx;
    const anchor = dx > 10 ? 'start' : dx < -10 ? 'end' : 'middle';

    // Offset the label slightly away from the chart edge
    const offsetX = dx > 10 ? 4 : dx < -10 ? -4 : 0;
    const offsetY = (y - cy) > 10 ? 4 : (y - cy) < -10 ? -4 : 0;

    return (
        <text
            x={x + offsetX}
            y={y + offsetY}
            textAnchor={anchor}
            fill="var(--color-text-muted)"
            fontSize={11}
            fontWeight={600}
            dominantBaseline="middle"
        >
            <tspan x={x + offsetX} dy={line2 ? '-0.6em' : '0'}>{line1}</tspan>
            {line2 && <tspan x={x + offsetX} dy="1.3em">{line2}</tspan>}
        </text>
    );
};

export default function HealthRadarChart({ data = [] }) {
    if (!data.length) return null;

    return (
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data} margin={{ top: 30, right: 50, bottom: 30, left: 50 }}>
                <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
                <PolarAngleAxis
                    dataKey="subject"
                    tick={<CustomTick />}
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
