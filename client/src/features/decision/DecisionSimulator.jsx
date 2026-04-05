import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { runDecisionSimulation, clearDecision } from './decisionSlice';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Icon from '../../components/ui/Icon';
import RecommendationList from '../../components/recommendations/RecommendationList';
import IncomeAllocationChart from '../../components/charts/IncomeAllocationChart';
import LoanBreakdownPieChart from '../../components/charts/LoanBreakdownPieChart';
import SavingsRateComparisonChart from '../../components/charts/SavingsRateComparisonChart';
import useAuth from '../../hooks/useAuth';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function DecisionSimulator() {
    useAuth();
    const dispatch = useDispatch();
    const { result, loading } = useSelector((s) => s.decision);

    const [form, setForm] = useState({
        purchase_cost: '',
        down_payment: '',
        interest_rate: '',
        loan_tenure_months: '',
    });

    const set = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(runDecisionSimulation({
                purchase_cost: parseFloat(form.purchase_cost) || 0,
                down_payment: parseFloat(form.down_payment) || 0,
                interest_rate: parseFloat(form.interest_rate) || 0,
                loan_tenure_months: parseInt(form.loan_tenure_months) || 0,
            })).unwrap();
            toast.success('Simulation complete!');
        } catch (err) {
            toast.error(err || 'Simulation failed');
        }
    };

    const loanAmount = Math.max((parseFloat(form.purchase_cost) || 0) - (parseFloat(form.down_payment) || 0), 0);
    const monthlyRate = ((parseFloat(form.interest_rate) || 0) / 100) / 12;
    const annualRatePercent = parseFloat(form.interest_rate) || 0;
    const previewAnnualRate = annualRatePercent > 0 ? `${+annualRatePercent.toFixed(2)}%` : '—';
    const previewMonthlyRate = monthlyRate > 0 ? `${+(monthlyRate * 100).toFixed(2)}%` : '—';

    const stressColor = {
        Strong: '#10b981', Stable: '#3b82f6', Risk: '#f59e0b', Critical: '#ef4444',
    };

    const decisionColor = {
        SAFE: '#10b981',
        MODERATE: '#eab308',
        RISKY: '#f97316',
        CRITICAL: '#ef4444',
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-6xl mx-auto">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Icon name="account_tree" className="text-[var(--color-primary)]" />
                    <h1 className="text-3xl font-black text-[var(--color-text)]">Decision Simulator</h1>
                </div>
                <p className="text-[var(--color-text-secondary)]">
                    Analyze the EMI impact of a loan or major purchase and see how it affects your savings and financial stability.
                </p>
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* ── Inputs ──────────────────────────────────────── */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl space-y-5">
                        <h3 className="text-base font-bold text-[var(--color-text)] flex items-center gap-2">
                            <Icon name="tune" className="text-[var(--color-primary)]" size={18} />
                            Loan Parameters
                        </h3>

                        {/* Purchase Cost */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Purchase Price / Asset Cost (₹)</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-[var(--color-text-muted)] font-medium select-none">₹</span>
                                <input
                                    type="number" inputMode="numeric"
                                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl pl-8 pr-4 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    value={form.purchase_cost}
                                    onChange={(e) => set('purchase_cost', e.target.value)}
                                    placeholder="0" min="0" required
                                />
                            </div>
                        </div>

                        {/* Down Payment */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]">
                                Down Payment (₹){form.purchase_cost ? ` — ${Math.round((parseFloat(form.down_payment || 0) / parseFloat(form.purchase_cost || 1)) * 100)}%` : ''}
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-[var(--color-text-muted)] font-medium select-none">₹</span>
                                <input
                                    type="number" inputMode="numeric"
                                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl pl-8 pr-4 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    value={form.down_payment}
                                    onChange={(e) => set('down_payment', e.target.value)}
                                    placeholder="0" min="0"
                                />
                            </div>
                        </div>

                        {/* Interest Rate — user enters % (e.g. 9) */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Annual Interest Rate (%)</label>
                            <div className="relative flex items-center">
                                <input
                                    type="number" inputMode="decimal" step="0.1" min="0" max="25"
                                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-3 pr-10 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    value={form.interest_rate}
                                    onChange={(e) => set('interest_rate', e.target.value)}
                                    placeholder="0"
                                    required
                                />
                                <span className="absolute right-3 text-[var(--color-text-muted)] font-medium text-sm select-none">%</span>
                            </div>
                        </div>

                        {/* Loan Tenure — free text input in months */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Loan Tenure (months)</label>
                            <input
                                type="number" inputMode="numeric" min="0" max="360"
                                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                value={form.loan_tenure_months}
                                onChange={(e) => set('loan_tenure_months', e.target.value)}
                                placeholder="0"
                                required
                            />
                            <p className="text-xs text-[var(--color-text-muted)]">
                                {parseInt(form.loan_tenure_months) > 0
                                    ? `${(parseInt(form.loan_tenure_months) / 12).toFixed(1)} years`
                                    : form.loan_tenure_months === '0' || form.loan_tenure_months === 0
                                        ? 'Full cash purchase (no loan)'
                                        : ''}
                            </p>
                        </div>

                        <Button type="submit" loading={loading} className="w-full" icon="play_arrow">
                            RUN SIMULATION
                        </Button>
                    </form>

                    {/* Quick Analysis */}
                    <div className="glass-panel p-6 rounded-2xl">
                        <h3 className="text-sm font-bold text-[var(--color-primary)] uppercase tracking-widest mb-4">Quick Analysis</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-[var(--color-text-secondary)]">Loan Amount</span>
                                <span className="font-bold text-[var(--color-text)]">{loanAmount > 0 ? formatCurrency(loanAmount) : '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--color-text-secondary)]">Annual Rate</span>
                                <span className="font-bold text-[var(--color-text)]">{previewAnnualRate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[var(--color-text-secondary)]">Monthly Rate</span>
                                <span className="font-bold text-[var(--color-text)]">{previewMonthlyRate}</span>
                            </div>
                            {result && (
                                <>
                                    <div className="flex justify-between mt-4 border-t border-[var(--color-border)] pt-4">
                                        <span className="text-[var(--color-text-secondary)]">Total Interest</span>
                                        <span className="font-bold text-[var(--color-text)]">{formatCurrency(result.total_interest)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--color-text-secondary)]">Total Repayment</span>
                                        <span className="font-bold text-[var(--color-text)]">{formatCurrency(result.total_repayment)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Results ──────────────────────────────────────── */}
                <div className="col-span-12 lg:col-span-8 space-y-6">
                    <AnimatePresence>
                        {result ? (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                                {/* Decision Badge */}
                                <div className="flex items-center gap-4 glass-panel p-5 rounded-2xl border-l-4" style={{ borderLeftColor: decisionColor[result.decision_label] }}>
                                    <div>
                                        <h3 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Affordability Decision</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-3xl font-black uppercase" style={{ color: decisionColor[result.decision_label] || '#3b82f6' }}>
                                                {result.decision_label}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Metric Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <Card title="Monthly EMI" value={formatCurrency(result.emi)} borderAccent="var(--color-primary)" />
                                    <Card
                                        title="Debt-to-Income"
                                        value={formatPercent(result.debt_ratio_after)}
                                        borderAccent={result.debt_ratio_after > 0.4 ? '#ef4444' : result.debt_ratio_after > 0.3 ? '#f59e0b' : '#10b981'}
                                    />
                                    <Card
                                        title="Disposable Income"
                                        value={formatCurrency(result.disposable_income_after)}
                                        borderAccent={result.disposable_income_after >= 0 ? '#10b981' : '#ef4444'}
                                    />
                                    <Card
                                        title="Savings Rate After"
                                        value={formatPercent(result.savings_rate_after)}
                                        borderAccent={result.savings_rate_after >= 0.2 ? '#10b981' : result.savings_rate_after >= 0.1 ? '#f59e0b' : '#ef4444'}
                                    />
                                </div>

                                {/* Before / After summary */}
                                <div className="glass-panel p-5 rounded-2xl">
                                    <h3 className="text-sm font-bold text-[var(--color-text)] mb-4">Impact Summary</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                        {[
                                            { label: 'Savings Rate Before', val: formatPercent(result.savings_rate_before) },
                                            { label: 'Savings Rate After', val: formatPercent(result.savings_rate_after) },
                                            { label: 'DTI Before', val: formatPercent(result.debt_ratio_before) },
                                            { label: 'DTI After', val: formatPercent(result.debt_ratio_after) },
                                        ].map((item) => (
                                            <div key={item.label} className="text-center p-3 rounded-xl bg-[var(--color-bg)]">
                                                <p className="text-[var(--color-text-muted)] text-xs mb-1">{item.label}</p>
                                                <p className="font-bold text-[var(--color-text)]">{item.val}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 3 Charts per spec */}
                                <IncomeAllocationChart
                                    expenses={Math.max(
                                        (result.monthly_income || 0) - result.total_emi - Math.max(result.disposable_income_after, 0),
                                        0
                                    )}
                                    emi={result.total_emi}
                                    savings={Math.max(result.disposable_income_after, 0)}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <LoanBreakdownPieChart
                                        principal={result.loan_amount}
                                        totalInterest={result.total_interest}
                                    />
                                    <SavingsRateComparisonChart
                                        rateBefore={result.savings_rate_before}
                                        rateAfter={result.savings_rate_after}
                                    />
                                </div>

                                {/* Recommendations */}
                                <RecommendationList recommendations={result.recommendations} />

                                <div className="flex justify-center">
                                    <Button variant="secondary" onClick={() => dispatch(clearDecision())} icon="refresh">
                                        Clear Results
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-[var(--color-surface)] flex items-center justify-center">
                                    <Icon name="calculate" className="text-[var(--color-primary)]" size={32} />
                                </div>
                                <h2 className="text-lg font-bold text-[var(--color-text)]">Configure & Simulate</h2>
                                <p className="text-[var(--color-text-secondary)] max-w-sm text-sm">
                                    Enter your loan parameters and run the simulation to see the complete financial impact analysis.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
