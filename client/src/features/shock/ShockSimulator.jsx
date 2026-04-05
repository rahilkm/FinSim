import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/ui/Icon';
import SavingsLineChart from '../../components/charts/SavingsLineChart';
import FinancialImpactBarChart from '../../components/charts/FinancialImpactBarChart';
import RecommendationList from '../../components/recommendations/RecommendationList';
import useAuth from '../../hooks/useAuth';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import toast from 'react-hot-toast';

const shockTypes = [
    { value: 'job_loss', label: 'Job Loss', icon: 'work_off' },
    { value: 'market_crash', label: 'Market Crash', icon: 'trending_down' },
    { value: 'medical_emergency', label: 'Medical', icon: 'medical_services' },
    { value: 'inflation_spike', label: 'Inflation', icon: 'show_chart' },
];

const riskColor = {
    Strong: '#10b981', Stable: '#3b82f6',
    Risk: '#f59e0b', Critical: '#ef4444',
};

export default function ShockSimulator() {
    useAuth();
    const { data: profile } = useSelector((s) => s.profile);

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const [form, setForm] = useState({
        selected_shocks: ['job_loss'],
        shock_duration_months: '6',
        income_loss_percent: '',
        unexpected_expense: '',
        market_drop_percent: '',
    });

    const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

    const toggleShock = (shockValue) => {
        setForm((prev) => {
            const current = prev.selected_shocks || [];
            if (current.includes(shockValue)) {
                return { ...prev, selected_shocks: current.filter(s => s !== shockValue) };
            } else {
                return { ...prev, selected_shocks: [...current, shockValue] };
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const incomeSources = profile?.income_sources || [];
            const expensesList = profile?.expenses || [];
            const assetsList = profile?.assets || [];
            const liabilitiesList = profile?.liabilities || [];
            const emi = profile?.existing_emi || 0;

            const income = incomeSources.reduce((s, i) => s + (Number(i.amount) || 0), 0);
            const expenses = expensesList.reduce((s, ex) => s + (Number(ex.amount) || 0), 0);
            const savings = Number(profile?.savings) || 0;
            const investments = Number(profile?.investments) || 0;
            const liabilitiesTotal = liabilitiesList.reduce((s, l) => s + (Number(l.value) || 0), 0);

            let netSavings = savings - liabilitiesTotal;
            if (netSavings < 0) netSavings = 0;

            const duration = Number(form.shock_duration_months) || 1;
            const incomeLoss = Number(form.income_loss_percent) || 0;
            const unexpectedExpense = Number(form.unexpected_expense) || 0;
            const marketDrop = Number(form.market_drop_percent) || 0;

            const incomeAfter = income * (1 - (incomeLoss / 100));
            const totalExpenses = expenses + emi + unexpectedExpense;
            const monthlyDeficit = totalExpenses - incomeAfter;

            let currentSavings = netSavings;
            const savings_timeline = [];
            
            savings_timeline.push({ month: 0, savings: currentSavings });

            for (let i = 0; i < duration; i++) {
                if (monthlyDeficit > 0) {
                    currentSavings -= monthlyDeficit;
                }
                if (currentSavings < 0) currentSavings = 0;
                
                savings_timeline.push({ month: i + 1, savings: currentSavings });
            }

            const investmentsAfter = investments * (1 - (marketDrop / 100));

            console.log({
                duration,
                monthlyDeficit,
                initialSavings: netSavings,
                finalSavings: currentSavings,
                investments,
                investmentsAfter
            });

            let emergencyMonths = totalExpenses === 0 ? 0 : (currentSavings / totalExpenses);
            let emergencyMonthsBefore = totalExpenses === 0 ? 0 : (netSavings / totalExpenses);

            let risk_level = 'Stable';
            if (emergencyMonths < 3) risk_level = 'Critical';
            else if (emergencyMonths >= 3 && emergencyMonths < 6) risk_level = 'Risk';
            else if (emergencyMonths >= 6) risk_level = 'Strong';

            const recommendations = [];
            if (currentSavings === 0) {
                recommendations.push({ text: 'Your savings will be fully depleted within the shock duration', type: 'savings' });
            } else if (currentSavings < netSavings) {
                recommendations.push({ text: 'Your net savings are projected to decline during this shock period', type: 'savings' });
            } else {
                recommendations.push({ text: 'Your savings continue to grow or remain stable despite the shock', type: 'savings' });
            }
            if (emergencyMonths < 3) {
                recommendations.push({ text: 'Your emergency fund falls below safe levels, indicating high financial vulnerability', type: 'savings' });
            } else if (emergencyMonths >= 6) {
                recommendations.push({ text: 'Your emergency fund remains strong despite the shock', type: 'savings' });
            }
            if (incomeLoss > 0) recommendations.push({ text: 'Your income reduction significantly impacts your monthly cash flow', type: 'expense' });
            if (marketDrop > 0) recommendations.push({ text: 'Your investments decline due to market conditions, reducing overall net worth', type: 'investment' });

            const netWorthBefore = netSavings + investments;
            const netWorthAfter = currentSavings + investmentsAfter;

            setResult({
                updated_income: incomeAfter,
                remaining_savings: currentSavings,
                emergency_months_before: emergencyMonthsBefore,
                emergency_months_after: emergencyMonths,
                risk_level: risk_level,
                savings_timeline,
                recommendations,

                savings_baseline: netSavings,
                investments_baseline: investments,
                new_investments: investmentsAfter,
                net_worth_before: netWorthBefore,
                net_worth_after: netWorthAfter
            });

            toast.success('Simulation complete!');
        } catch (err) {
            console.error(err);
            toast.error('Simulation failed');
        } finally {
            setLoading(false);
        }
    };

    const showIncomeLoss = form.selected_shocks.includes('job_loss');
    const showMarketDrop = form.selected_shocks.includes('market_crash');
    const showUnexpectedExpense = form.selected_shocks.includes('medical_emergency') || form.selected_shocks.includes('inflation_spike');
    const showParameters = form.selected_shocks.length > 0;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <Icon name="bolt" className="text-amber-500" />
                    <h1 className="text-3xl font-black text-[var(--color-text)]">Shock Simulator</h1>
                </div>
                <p className="text-[var(--color-text-secondary)]">
                    Simulate financial shocks — job loss, market crash, or medical emergency — to see their impact on your financial stability.
                </p>
            </div>

            {/* Simulation Setup */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Inputs Card */}
                <form onSubmit={handleSubmit} className="lg:col-span-8 glass-panel p-6 rounded-2xl flex flex-col gap-8">
                    {/* Shock Type Selection */}
                    <div>
                        <h3 className="text-base font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
                            <Icon name="category" className="text-[var(--color-primary)]" size={18} />
                            Select Shock Types
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {shockTypes.map((type) => {
                                const isSelected = form.selected_shocks.includes(type.value);
                                return (
                                    <button
                                        key={type.value}
                                        type="button"
                                        onClick={() => toggleShock(type.value)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                                            isSelected
                                                ? 'bg-[rgba(34,211,238,0.12)] border-[#22d3ee] text-[#22d3ee]'
                                                : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/50'
                                        }`}
                                    >
                                        <Icon name={type.icon} size={28} className="mb-2" />
                                        <span className="text-xs font-bold text-center">{type.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Parameters */}
                    {showParameters ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-sm font-medium text-[var(--color-text-secondary)]">Duration: {form.shock_duration_months} months</label>
                                <input
                                    className="w-full accent-[var(--color-primary)] h-2 bg-[var(--color-border)] rounded-lg appearance-none cursor-pointer"
                                    max="24" min="1" type="range"
                                    value={form.shock_duration_months}
                                    onChange={(e) => set('shock_duration_months', e.target.value)}
                                />
                                <div className="flex justify-between text-xs text-[var(--color-text-muted)]">
                                    <span>1 mo</span><span>24 mo</span>
                                </div>
                            </div>
                            
                            {showIncomeLoss && (
                                <Input
                                    id="shock-income-loss"
                                    label="Income Loss (%)"
                                    type="number"
                                    min="0" max="100" step="1"
                                    value={form.income_loss_percent}
                                    onChange={(e) => set('income_loss_percent', e.target.value)}
                                    suffix="%"
                                />
                            )}
                            
                            {showUnexpectedExpense && (
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-[var(--color-text-secondary)]">Unexpected Expense (₹)</label>
                                    <div className="relative flex items-center">
                                        <span className="absolute left-3 text-[var(--color-text-muted)] font-medium select-none">₹</span>
                                        <input
                                            type="number"
                                            inputMode="numeric"
                                            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl pl-8 pr-4 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            value={form.unexpected_expense}
                                            onChange={(e) => set('unexpected_expense', e.target.value)}
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            )}

                            {showMarketDrop && (
                                <Input
                                    id="shock-market"
                                    label="Market Drop (%)"
                                    type="number"
                                    min="0" max="100" step="1"
                                    value={form.market_drop_percent}
                                    onChange={(e) => set('market_drop_percent', e.target.value)}
                                    suffix="%"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="text-center p-8 bg-[var(--color-bg)] rounded-xl border border-dashed border-[var(--color-border)]">
                            <p className="text-[var(--color-text-secondary)]">Select one or more shock types above to configure parameters.</p>
                        </div>
                    )}

                    <Button type="submit" loading={loading} icon="play_arrow" className="w-full py-4 text-base">
                        RUN SIMULATION
                    </Button>
                </form>

                {/* Summary Stats */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="glass-panel p-5 rounded-2xl">
                        <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">Updated Monthly Income</p>
                        <h4 className={`text-2xl font-black ${result ? (result.updated_income <= 0 ? 'text-red-500' : 'text-[var(--color-text)]') : 'text-[var(--color-text-muted)]'}`}>
                            {result ? formatCurrency(result.updated_income) : '—'}
                        </h4>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl">
                        <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">Remaining Savings</p>
                        <h4 className="text-2xl font-black text-[var(--color-text)]">
                            {result ? formatCurrency(result.remaining_savings) : '—'}
                        </h4>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl">
                        <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">Emergency Fund — Before</p>
                        <h4 className="text-2xl font-black text-[var(--color-text)]">
                            {result ? `${result.emergency_months_before.toFixed(1)} months` : '—'}
                        </h4>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl">
                        <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">Emergency Fund — After</p>
                        <h4 className="text-2xl font-black" style={{ color: result ? (riskColor[result.risk_level] || '#f59e0b') : 'var(--color-text-muted)' }}>
                            {result ? `${result.emergency_months_after.toFixed(1)} months` : '—'}
                        </h4>
                    </div>
                    <div
                        className="glass-panel p-5 rounded-2xl border-l-4"
                        style={{ borderLeftColor: result ? (riskColor[result.risk_level] || '#f59e0b') : 'var(--color-border)' }}
                    >
                        <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-1">Risk Level</p>
                        <h4 className="text-xl font-black uppercase" style={{ color: result ? (riskColor[result.risk_level] || '#f59e0b') : 'var(--color-text-muted)' }}>
                            {result ? result.risk_level : '—'}
                        </h4>
                    </div>
                </div>
            </section>

            {/* Results — Charts + Recommendations */}
            <AnimatePresence>
                {result && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                        {/* Row 1: Savings Timeline + Recommendations */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            <div className="lg:col-span-8">
                                <SavingsLineChart data={result.savings_timeline} />
                            </div>
                            <div className="lg:col-span-4">
                                <RecommendationList recommendations={result.recommendations} />
                            </div>
                        </div>

                        {/* Row 2: Unified Financial Impact Bar */}
                        <div className="grid grid-cols-1 gap-6">
                            <FinancialImpactBarChart
                                savingsBefore={result.savings_baseline}
                                savingsAfter={result.remaining_savings}
                                investmentsBefore={result.investments_baseline}
                                investmentsAfter={result.new_investments}
                                netWorthBefore={result.net_worth_before}
                                netWorthAfter={result.net_worth_after}
                            />
                        </div>

                        <div className="flex justify-center">
                            <Button variant="secondary" onClick={() => setResult(null)} icon="refresh">
                                Clear Results
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
