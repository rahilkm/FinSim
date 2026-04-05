import { motion } from 'framer-motion';
import Icon from '../ui/Icon';

const typeColors = {
    debt: 'var(--color-danger)',
    savings: 'var(--color-success)',
    expense: 'var(--color-warning)',
    investment: 'var(--color-info)',
};

export default function RecommendationList({ recommendations = [] }) {
    if (!recommendations.length) return null;

    return (
        <div className="glass-panel rounded-2xl p-6 bg-[var(--color-surface)]">
            <div className="flex items-center gap-2 mb-4 text-[var(--color-primary)]">
                <Icon name="lightbulb" />
                <h3 className="font-bold">Recommendations</h3>
            </div>
            <ul className="flex flex-col gap-4">
                {recommendations.map((rec, i) => (
                    <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-3"
                    >
                        <Icon
                            name="check_circle"
                            className="text-[var(--color-primary)] mt-0.5 flex-shrink-0"
                            size={16}
                        />
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{rec.text}</p>
                    </motion.li>
                ))}
            </ul>
        </div>
    );
}
