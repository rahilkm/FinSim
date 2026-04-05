import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile } from '../profile/profileSlice';
import { fetchDashboard } from './dashboardSlice';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Icon from '../../components/ui/Icon';
import Skeleton from '../../components/ui/Skeleton';
import ExpenseBarChart from '../../components/charts/ExpenseBarChart';
import AssetPieChart from '../../components/charts/AssetPieChart';
import useAuth from '../../hooks/useAuth';
import { formatCurrency, formatPercent } from '../../utils/formatters';

export default function DashboardPage() {
    useAuth();
    const dispatch = useDispatch();
    const { data: profile, loading: profileLoading } = useSelector((s) => s.profile);
    const { data: dashboard, loading: dashLoading } = useSelector((s) => s.dashboard || {});

    useEffect(() => { dispatch(fetchProfile()); }, [dispatch]);
    useEffect(() => { dispatch(fetchDashboard()); }, [dispatch]);

    const loading = profileLoading || dashLoading;

    if (loading && !profile && !dashboard) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Skeleton className="h-28" count={5} />
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface)] flex items-center justify-center">
                    <Icon name="account_balance_wallet" className="text-[var(--color-primary)]" size={32} />
                </div>
                <h2 className="text-xl font-bold text-[var(--color-text)]">Set up your financial profile</h2>
                <p className="text-[var(--color-text-secondary)] max-w-sm">
                    Create your financial profile to unlock the dashboard, simulations, and health analysis.
                </p>
                <Link
                    to="/profile"
                    className="mt-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-[#0a1214] font-bold text-sm hover:brightness-110 transition-all"
                >
                    Create Profile
                </Link>
            </motion.div>
        );
    }

    // Use dashboard API data when available, fall back to local calculations
    const d = dashboard || {};
    const netWorth = d.net_worth ?? ((profile.total_assets || 0) - (profile.total_liabilities || 0));
    const savingsRate = d.savings_rate ?? 0;
    const emergencyMonths = d.emergency_months ?? 0;
    const debtToIncome = d.debt_to_income ?? 0;
    const healthScore = d.financial_health_score ?? 0;
    const riskLevel = d.risk_level ?? '—';
    const assetsList = profile.assets || [];

    const income = d.monthly_income ?? profile.monthly_income ?? 0;
    const expenses = d.monthly_expenses ?? profile.monthly_expenses ?? 0;
    const emi = d.existing_emi ?? profile.existing_emi ?? 0;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {/* ── 5 Metric Cards ──────────────────────────────────────── */}
            <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <Card
                    title="Net Worth"
                    value={formatCurrency(netWorth)}
                    borderAccent="var(--color-primary)"
                />
                <Card
                    title="Savings Rate"
                    value={formatPercent(savingsRate)}
                    trendDirection={savingsRate >= 0.2 ? 'up' : savingsRate >= 0.1 ? 'neutral' : 'down'}
                />
                <Card
                    title="Emergency Fund"
                    value={`${Number.isInteger(emergencyMonths) ? emergencyMonths : emergencyMonths.toFixed(1)} mo`}
                    trendDirection={emergencyMonths >= 6 ? 'up' : emergencyMonths >= 3 ? 'neutral' : 'down'}
                />
                <Card
                    title="Debt-to-Income"
                    value={formatPercent(debtToIncome)}
                    trendDirection={debtToIncome > 0.4 ? 'down' : debtToIncome > 0.3 ? 'neutral' : 'up'}
                />
                <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-[var(--color-text-muted)] text-xs font-semibold mb-1 uppercase tracking-wider">Health Score</p>
                        <h3 className="text-2xl font-bold text-[var(--color-text)]">
                            {healthScore}/100
                        </h3>
                        <div className="flex items-center gap-1 mt-2 text-[var(--color-primary)]">
                            <Icon name="verified" size={14} className="font-bold" />
                            <span className="text-xs font-bold">{riskLevel}</span>
                        </div>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-transparent rounded-full" />
                </div>
            </section>

            {/* ── Charts Row: Income vs Expenses + Asset Allocation ──── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExpenseBarChart
                    income={income}
                    expenses={expenses}
                    emi={emi}
                />

                {assetsList.length > 0 ? (
                    <AssetPieChart assets={assetsList} />
                ) : (
                    <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center min-h-[300px]">
                        <Icon name="pie_chart" className="text-[var(--color-text-muted)] mb-3" size={40} />
                        <h3 className="text-base font-bold text-[var(--color-text)] mb-2">Asset Allocation</h3>
                        <p className="text-sm text-[var(--color-text-muted)] text-center">Add assets to your financial profile to view allocation.</p>
                    </div>
                )}
            </div>

            {/* ── Quick Navigation to Simulators ──────────────────────── */}
            <section className="glass-panel rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-[var(--color-border)]">
                    <h3 className="text-lg font-bold text-[var(--color-text)]">Run a Simulation</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">Use the modules below to analyze financial scenarios.</p>
                </div>
                <div className="divide-y divide-[var(--color-border)]">
                    {[
                        { to: '/shock', icon: 'bolt', title: 'Shock Simulator', desc: 'Simulate job loss, market crash, medical emergencies', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                        { to: '/decision', icon: 'account_tree', title: 'Decision Simulator', desc: 'Analyze EMI impact of loans and major purchases', color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-surface)]' },
                        { to: '/health', icon: 'verified_user', title: 'Resilience Analyzer', desc: 'Calculate your financial health score and resilience', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
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
