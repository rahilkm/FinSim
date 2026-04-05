export default function HealthScoreGauge({ score = 0, label = 'Score', size = 192 }) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (circumference * score) / 100;

    const getLabel = () => {
        if (score >= 80) return 'Optimized';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Needs Work';
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative" style={{ width: size, height: size }}>
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                        cx="50" cy="50" r={radius}
                        fill="transparent"
                        stroke="var(--color-border)"
                        strokeWidth="8"
                    />
                    <circle
                        cx="50" cy="50" r={radius}
                        fill="transparent"
                        stroke="var(--color-primary)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-black text-[var(--color-text)]">{score}</span>
                    <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">
                        {getLabel()}
                    </span>
                </div>
            </div>
        </div>
    );
}
