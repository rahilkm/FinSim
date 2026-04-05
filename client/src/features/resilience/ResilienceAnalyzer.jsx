import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchResilience } from './resilienceSlice';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import Skeleton from '../../components/ui/Skeleton';
import HealthScoreGauge from '../../components/charts/HealthScoreGauge';
import HealthRadarChart from '../../components/charts/HealthRadarChart';
import RecommendationList from '../../components/recommendations/RecommendationList';
import useAuth from '../../hooks/useAuth';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export default function ResilienceAnalyzer() {
    useAuth();
    const dispatch = useDispatch();
    const { result, loading, error } = useSelector((s) => s.resilience);

    useEffect(() => { dispatch(fetchResilience()); }, [dispatch]);

    const riskColor = {
        Strong: 'var(--color-success)', Stable: 'var(--color-info)',
        Risk: 'var(--color-warning)', Critical: 'var(--color-danger)',
    };

    if (loading && !result) {
        return (
            <div className="space-y-6 max-w-6xl mx-auto">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Skeleton className="h-28" count={4} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto text-center py-20 space-y-4">
                <p className="text-[var(--color-text-secondary)]">{error}</p>
                <Button onClick={() => dispatch(fetchResilience())}>Retry</Button>
            </div>
        );
    }

    if (!result) return null;

    const dimensions = [
        { label: 'Income Stability', value: Math.round((result.savings_score || 0) * 0.85) },
        { label: 'Savings Strength', value: result.savings_score || 0 },
        { label: 'Debt Management', value: result.debt_score || 0 },
        { label: 'Emergency Buffer', value: result.emergency_fund_score || 0 },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <header className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-[var(--color-text)]">Financial Resilience</h2>
                    <p className="text-[var(--color-text-secondary)] mt-1">
                        Real-time assessment of your financial health and risk exposure.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button variant="secondary" onClick={() => dispatch(fetchResilience())} loading={loading} icon="refresh">
                        Refresh
                    </Button>
                </div>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                    title="Net Worth"
                    value={formatCurrency(result.net_worth)}
                    trend="+5.2%"
                    trendDirection="up"
                />
                <Card
                    title="Savings Rate"
                    value={formatPercent(result.savings_rate)}
                    trend="+1.2%"
                    trendDirection="up"
                />
                <Card
                    title="Emergency Fund"
                    value={`${result.emergency_months} Months`}
                    trend={result.emergency_months < 6 ? '-0.1m' : 'Stable'}
                    trendDirection={result.emergency_months < 6 ? 'down' : 'neutral'}
                />
                <Card
                    title="Debt-to-Income"
                    value={formatPercent(result.debt_to_income)}
                    trend="-2.5%"
                    trendDirection="up"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Health Score & Radar Chart Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Score Card */}
                    <div className="glass-panel rounded-3xl p-8 relative overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <HealthScoreGauge score={result.financial_health_score} size={192} />
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-[var(--color-text)] mb-3">
                                    {result.risk_level === 'Strong' ? 'Excellent Stability' :
                                        result.risk_level === 'Stable' ? 'Good Standing' :
                                            result.risk_level === 'Risk' ? 'Needs Attention' : 'Critical Status'}
                                </h3>
                                <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
                                    Your financial resilience score is <span className="text-[var(--color-primary)] font-bold">{result.financial_health_score}/100</span>.
                                    {' '}Your current risk level is rated as {result.risk_level}.
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    {result.savings_score >= 60 && (
                                        <div className="px-4 py-2 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold border border-[var(--color-primary)]/30 uppercase tracking-wide">
                                            Strong Savings
                                        </div>
                                    )}
                                    {result.debt_score >= 60 && (
                                        <div className="px-4 py-2 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-bold border border-[var(--color-primary)]/30 uppercase tracking-wide">
                                            Low Debt Risk
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resilience Dimensions */}
                    <div className="glass-panel rounded-3xl p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-[var(--color-text)]">Resilience Dimensions</h3>
                        </div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                            {/* Radar Chart */}
                            {result.radar_data ? (
                                <div className="w-64 h-64 flex items-center justify-center flex-shrink-0">
                                    <HealthRadarChart data={result.radar_data} />
                                </div>
                            ) : (
                                <div className="w-64 h-64 flex items-center justify-center">
                                    <div className="w-48 h-48 bg-transparent rounded-full" />
                                </div>
                            )}
                            {/* Dimension bars */}
                            <div className="flex-1 space-y-4 w-full">
                                {dimensions.map((dim) => (
                                    <div key={dim.label} className="flex justify-between items-center p-3 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
                                        <span className="text-sm font-medium text-[var(--color-text)]">{dim.label}</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${dim.value}%` }}
                                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                                    className="h-full bg-[var(--color-primary)] rounded-full"
                                                />
                                            </div>
                                            <span className="text-xs font-bold w-8 text-right text-[var(--color-text)]">{dim.value}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recommendations Panel */}
                <div className="space-y-6">
                    <div className="glass-panel rounded-3xl p-6 h-full flex flex-col">
                        <h3 className="text-xl font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
                            <Icon name="auto_awesome" className="text-[var(--color-primary)]" />
                            AI Recommendations
                        </h3>
                        <div className="space-y-4 flex-1">
                            {result.recommendations?.length > 0 ? (
                                result.recommendations.map((rec, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer group"
                                    >
                                        <div className="flex gap-3 mb-2">
                                            <Icon name="lightbulb" className="text-[var(--color-primary)]" size={18} />
                                            <h4 className="font-bold text-sm text-[var(--color-text)]">
                                                {rec.type ? rec.type.charAt(0).toUpperCase() + rec.type.slice(1) + ' Tip' : 'Insight'}
                                            </h4>
                                        </div>
                                        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
                                            {rec.text}
                                        </p>
                                        <div className="flex justify-end">
                                            <span className="text-[10px] font-bold text-[var(--color-primary)] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                VIEW DETAILS <Icon name="chevron_right" size={12} />
                                            </span>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-sm text-[var(--color-text-muted)]">No recommendations available yet.</p>
                            )}
                        </div>
                        <Button className="mt-6 w-full" icon="download">
                            Full Resilience Report
                        </Button>
                    </div>
                </div>
            </div>


        </motion.div>
    );
}
