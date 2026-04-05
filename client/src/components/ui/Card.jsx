import { motion } from 'framer-motion';
import Icon from './Icon';

export default function Card({
    title,
    value,
    subtitle,
    icon,
    iconComponent: IconComp,
    color = 'var(--color-primary)',
    borderAccent,
    trend,
    trendDirection,
    className = '',
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-panel glow-panel p-4 ${borderAccent ? `border-l-4` : ''} ${className}`}
            style={{
                ...(borderAccent ? { borderLeftColor: borderAccent } : {}),
                wordWrap: 'break-word',
                overflow: 'visible',
                lineHeight: 1.5
            }}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-[var(--color-text-muted)] text-xs font-semibold uppercase tracking-wider mb-1">
                        {title}
                    </p>
                    <h3 className="text-2xl font-bold text-[var(--color-text)]">{value}</h3>
                    {subtitle && (
                        <p className="text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
                    )}
                    {trend && (
                        <div
                            className="flex items-center gap-1 mt-2 text-xs font-bold"
                            style={{
                                color: trendDirection === 'up'
                                    ? 'var(--color-success)'
                                    : trendDirection === 'down'
                                        ? 'var(--color-danger)'
                                        : 'var(--color-primary)',
                            }}
                        >
                            <Icon
                                name={
                                    trendDirection === 'up'
                                        ? 'trending_up'
                                        : trendDirection === 'down'
                                            ? 'trending_down'
                                            : 'horizontal_rule'
                                }
                                size={14}
                                className="font-bold"
                            />
                            <span>{trend}</span>
                        </div>
                    )}
                </div>
                {(icon || IconComp) && (
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${color}15`, color }}
                    >
                        {icon ? (
                            <Icon name={icon} size={20} />
                        ) : IconComp ? (
                            <IconComp className="w-5 h-5" />
                        ) : null}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
