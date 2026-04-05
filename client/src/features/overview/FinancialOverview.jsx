import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Icon from '../../components/ui/Icon';
import Skeleton from '../../components/ui/Skeleton';
import ExpenseBarChart from '../../components/charts/ExpenseBarChart';
import AssetPieChart from '../../components/charts/AssetPieChart';
import HealthScoreGauge from '../../components/charts/HealthScoreGauge';
import HealthRadarChart from '../../components/charts/HealthRadarChart';
import Button from '../../components/ui/Button';
import useAuth from '../../hooks/useAuth';
import useFinancialMetrics from '../../hooks/useFinancialMetrics';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export default function FinancialOverview() {
    useAuth();
    
    const {
        loading,
        error,
        hasProfile,
        income,
        expenses,
        emi,
        savings,
        netWorth,
        savingsRate,
        emergencyMonths,
        debtToIncome,
        assetAllocation,
        assets,
        financialHealthScore,
        riskLevel,
        radarData,
        recommendations,
        savingsScore,
        debtScore,
        emergencyFundScore
    } = useFinancialMetrics();

    if (loading && !hasProfile) {
        return (
            <div className="space-y-6 max-w-6xl mx-auto">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Skeleton className="h-28" count={4} />
                </div>
            </div>
        );
    }



    const dimensions = [
        { label: 'Income Stability', value: Math.round((savingsScore || 0) * 0.85) },
        { label: 'Savings Strength', value: savingsScore || 0 },
        { label: 'Debt Management', value: debtScore || 0 },
        { label: 'Emergency Buffer', value: emergencyFundScore || 0 },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <header className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                <div>
                    <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">Financial Overview</h2>
                    <p className="text-[var(--color-text-muted)] mt-1 text-sm">
                        Real-time assessment of your financial health, net worth, and risk exposure.
                    </p>
                </div>
            </header>

            {/* 1. Core Metrics Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                    title="Net Worth"
                    value={formatCurrency(netWorth)}
                />
                <Card
                    title="Savings Rate"
                    value={formatPercent(savingsRate)}
                />
                <Card
                    title="Emergency Fund"
                    value={`${Number.isInteger(emergencyMonths) ? emergencyMonths : emergencyMonths.toFixed(1)} mo`}
                />
                <Card
                    title="Debt-to-Income"
                    value={formatPercent(debtToIncome)}
                />
            </section>

            {/* 2. Charts Row: Income vs Expenses + Asset Allocation */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExpenseBarChart
                    income={income}
                    expenses={expenses}
                    emi={emi}
                />

                {assets && assets.length > 0 ? (
                    <AssetPieChart assets={assets} />
                ) : (
                    <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
                        <Icon name="pie_chart" className="text-[var(--color-text-muted)] mb-3" size={40} />
                        <h3 className="text-base font-bold text-[var(--color-text)] mb-2">Asset Allocation</h3>
                        <p className="text-sm text-[var(--color-text-muted)] text-center">Add assets to your financial profile to view allocation.</p>
                    </div>
                )}
            </section>

            {/* 3. Financial Health Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Health Score & Radar Chart Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Score Card */}
                    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <HealthScoreGauge score={financialHealthScore} size={192} />
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">
                                    {riskLevel === 'Strong' ? 'Excellent Stability' :
                                        riskLevel === 'Stable' ? 'Good Standing' :
                                            riskLevel === 'Risk' ? 'Needs Attention' : 'Critical Status'}
                                </h3>
                                <p className="text-[var(--color-text-muted)] leading-relaxed mb-6 text-sm">
                                    Your financial resilience score is <span className="text-[var(--color-primary)] font-bold">{financialHealthScore}/100</span>.
                                    {' '}Your current risk level is rated as {riskLevel}.
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                                    {savingsScore >= 60 && (
                                        <div className="px-4 py-2 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-semibold border border-[var(--color-primary)]/30 uppercase tracking-wide">
                                            Strong Savings
                                        </div>
                                    )}
                                    {debtScore >= 60 && (
                                        <div className="px-4 py-2 rounded-full bg-[var(--color-primary)]/20 text-[var(--color-primary)] text-xs font-semibold border border-[var(--color-primary)]/30 uppercase tracking-wide">
                                            Low Debt Risk
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resilience Dimensions */}
                    <div className="glass-panel rounded-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-[var(--color-text)]">Resilience Dimensions</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-8">
                            {/* Radar Chart */}
                            <div className="w-full h-[300px] flex items-center justify-center p-2">
                                {radarData ? (
                                    <HealthRadarChart data={radarData} />
                                ) : (
                                    <div className="w-48 h-48 bg-[var(--color-surface)] rounded-full blur-xl" />
                                )}
                            </div>
                            {/* Dimension bars */}
                            <div className="flex-1 space-y-4 w-full">
                                {dimensions.map((dim) => (
                                    <div key={dim.label} className="flex justify-between items-center p-3 rounded-xl bg-[var(--color-surface-hover)] border border-[var(--color-border)]">
                                        <span className="text-sm font-semibold text-[var(--color-text)]">{dim.label}</span>
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

                <div className="space-y-6">
                    <div className="glass-panel rounded-2xl p-6 h-full flex flex-col">
                        <h3 className="text-xl font-semibold text-[var(--color-text)] mb-6 flex items-center gap-2">
                            <Icon name="auto_awesome" className="text-[var(--color-primary)]" />
                            Financial Insights
                        </h3>
                        <div className="space-y-4 flex-1">
                            {recommendations?.length > 0 ? (
                                recommendations.map((rec, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] transition-colors cursor-default"
                                    >
                                        <div className="flex gap-3 mb-2">
                                            <Icon name="lightbulb" className="text-[var(--color-primary)]" size={18} />
                                            <h4 className="font-semibold text-sm text-[var(--color-text)]">
                                                {rec.type ? rec.type.charAt(0).toUpperCase() + rec.type.slice(1) + ' Insight' : 'Insight'}
                                            </h4>
                                        </div>
                                        <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                                            {rec.text}
                                        </p>
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-sm text-[var(--color-text-muted)]">No recommendations available yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. Quick Navigation to Simulators */}
            <section className="glass-panel rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-[var(--color-border)]">
                    <h3 className="text-lg font-bold text-[var(--color-text)]">Run a Simulation</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">Use the modules below to analyze financial scenarios.</p>
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                    {[
                        { to: '/shock', icon: 'bolt', title: 'Shock Simulator', desc: 'Simulate job loss, market crash, medical emergencies', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                        { to: '/decision', icon: 'account_tree', title: 'Decision Simulator', desc: 'Analyze EMI impact of loans and major purchases', color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-surface)]' }
                    ].map((item) => (
                        <Link
                            to={item.to}
                            key={item.title}
                            className="p-6 flex items-center gap-4 hover:bg-[var(--color-surface)] transition-colors"
                        >
                            <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color}`}>
                                <Icon name={item.icon} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-[var(--color-text)]">{item.title}</h4>
                                <p className="text-xs text-[var(--color-text-muted)]">{item.desc}</p>
                            </div>
                            <Icon name="arrow_forward" className="text-[var(--color-text-muted)]" size={18} />
                        </Link>
                    ))}
                </div>
            </section>
        </motion.div>
    );
}
