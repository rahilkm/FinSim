import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, saveProfile } from './profileSlice';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// ── Helpers ──────────────────────────────────────────────────────────────────

function newItem(name = '', amount = '') {
    return { name, amount };
}

function newValueItem(name = '', value = '') {
    return { name, value };
}

// ── Reusable subcomponents ────────────────────────────────────────────────────

/** Section card wrapper */
function Section({ icon, title, color = 'var(--color-primary)', children }) {
    return (
        <section className="glass-panel p-6 rounded-xl">
            <div className="flex items-center gap-2 mb-6 border-b border-[var(--color-border)] pb-4">
                <Icon name={icon} style={{ color }} />
                <h3 className="text-lg font-bold text-[var(--color-text)]">{title}</h3>
            </div>
            {children}
        </section>
    );
}

/** Numeric input that hides spinner arrows */
function RupeeInput({ label, value, onChange, placeholder = '0' }) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">{label}</label>
            <div className="relative flex items-center">
                <span className="absolute left-3 text-[var(--color-text-muted)] font-medium select-none">₹</span>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl pl-8 pr-4 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
                    value={value === 0 || value === "0" ? "" : value}
                    onChange={onChange}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}

/** A row in a dynamic list (name + amount/value) */
function ListRow({ nameLabel, amountLabel, isValue, item, onChange, onDelete }) {
    const key = isValue ? 'value' : 'amount';
    return (
        <div className="flex items-end gap-3">
            <div className="flex-1">
                <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1 block">{nameLabel}</label>
                <input
                    type="text"
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
                    value={item.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    placeholder={nameLabel}
                />
            </div>
            <div className="flex-1">
                <label className="text-xs font-medium text-[var(--color-text-muted)] mb-1 block">{amountLabel}</label>
                <div className="relative flex items-center">
                    <span className="absolute left-3 text-[var(--color-text-muted)] font-medium select-none text-sm">₹</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl pl-8 pr-4 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
                        value={item[key] === 0 || item[key] === "0" ? "" : item[key]}
                        onChange={(e) => onChange(key, e.target.value)}
                        placeholder="0"
                    />
                </div>
            </div>
            <button
                type="button"
                onClick={onDelete}
                className="mb-0.5 p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-all"
                aria-label="Delete"
            >
                <Icon name="delete" size={18} />
            </button>
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

const DEFAULT_EXPENSES = [
    { name: 'Housing', amount: '' },
    { name: 'Food & Groceries', amount: '' },
    { name: 'Transport', amount: '' },
    { name: 'Utilities', amount: '' },
    { name: 'Insurance', amount: '' },
    { name: 'Subscriptions', amount: '' },
    { name: 'Other Expenses', amount: '' },
];

const DEFAULT_ASSETS = [
    { name: 'Savings', value: '' },
    { name: 'Investments', value: '' },
    { name: 'Other Assets', value: '' },
];

const DEFAULT_LIABILITIES = [
    { name: 'Home Loan', value: '' },
    { name: 'Personal Loan', value: '' },
    { name: 'Credit Card Debt', value: '' },
    { name: 'Other Liabilities', value: '' },
];

export default function ProfileSetup() {
    useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data: profile, loading } = useSelector((s) => s.profile);
    const { user } = useSelector((s) => s.auth);

    // Personal Details
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [inflationRate, setInflationRate] = useState('6');
    const [existingEmi, setExistingEmi] = useState('');

    // Track whether we've seeded the form from the API yet.
    // We only seed ONCE (on first load) — never again after the user edits.
    const seeded = useRef(false);

    // Structured lists
    const [incomeSources, setIncomeSources] = useState([newItem('Primary Salary', '')]);
    const [expenses, setExpenses] = useState(DEFAULT_EXPENSES.map((e) => ({ ...e })));
    const [assets, setAssets] = useState(DEFAULT_ASSETS.map((a) => ({ ...a })));
    const [liabilities, setLiabilities] = useState(DEFAULT_LIABILITIES.map((l) => ({ ...l })));

    // Load existing profile
    useEffect(() => {
        const saved = localStorage.getItem("userProfile");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.fullName) setFullName(parsed.fullName);
                setEmail(parsed.email || user?.email || "");
            } catch (e) {}
        } else if (user?.email) {
            setEmail(user.email);
        }
        dispatch(fetchProfile()); 
    }, [dispatch, user]);

    console.log("Email:", email);

    useEffect(() => {
        // Only seed the form from the API response on first load.
        // After that, the user owns the form state — do NOT overwrite on save.
        if (seeded.current) return;

        if (profile) {
            seeded.current = true;
            setFullName(profile.full_name || user?.full_name || '');
            setInflationRate(profile.inflation_rate != null ? (profile.inflation_rate * 100).toString() : '6');
            setExistingEmi(profile.existing_emi != null ? profile.existing_emi.toString() : '');

            if (profile.income_sources?.length) setIncomeSources(profile.income_sources.map((x) => ({ name: x.name, amount: x.amount?.toString() || '' })));
            if (profile.expenses?.length) setExpenses(profile.expenses.map((x) => ({ name: x.name, amount: x.amount?.toString() || '' })));
            if (profile.assets?.length) setAssets(profile.assets.map((x) => ({ name: x.name, value: x.value?.toString() || '' })));
            if (profile.liabilities?.length) setLiabilities(profile.liabilities.map((x) => ({ name: x.name, value: x.value?.toString() || '' })));
        } else if (user) {
            setFullName(user.full_name || '');
        }
    }, [profile, user]);

    // List mutation helpers
    const updateList = (setter, index, field, value) =>
        setter((prev) => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));

    const addToList = (setter, isValue) =>
        setter((prev) => [...prev, isValue ? newValueItem() : newItem()]);

    const removeFromList = (setter, index) =>
        setter((prev) => prev.filter((_, i) => i !== index));

    // Build payload and save
    const buildPayload = () => ({
        full_name:      fullName,
        income_sources: incomeSources.map((x) => ({ name: x.name, amount: parseFloat(x.amount) || 0 })),
        expenses:       expenses.map((x) => ({ name: x.name, amount: parseFloat(x.amount) || 0 })),
        assets:         assets.map((x) => ({ name: x.name, value: parseFloat(x.value) || 0 })),
        liabilities:    liabilities.map((x) => ({ name: x.name, value: parseFloat(x.value) || 0 })),
        existing_emi:   parseFloat(existingEmi) || 0,
        inflation_rate: (parseFloat(inflationRate) || 6) / 100,
    });

    const handleSave = async (e, redirect = false) => {
        e.preventDefault();
        try {
            await dispatch(saveProfile(buildPayload())).unwrap();
            
            localStorage.setItem("userName", fullName);
            
            const profileData = {
                fullName: fullName,
                email: email || user?.email || "",
            };
            localStorage.setItem("userProfile", JSON.stringify(profileData));

            window.dispatchEvent(new Event("userUpdated"));

            toast.success("Profile saved", {
                icon: "✓",
            });
            if (redirect) navigate('/');
        } catch (err) {
            toast.error(err || 'Failed to save profile');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
                <div>
                    <h2 className="text-3xl font-black text-[var(--color-text)] tracking-tight">Financial Profile</h2>
                    <p className="text-[var(--color-text-secondary)] mt-2 max-w-xl">
                        Enter your financial baseline. These values drive all simulations — shock testing, loan analysis, and health scoring.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" onClick={(e) => handleSave(e)} loading={loading}>
                        Save Changes
                    </Button>
                    <Button onClick={(e) => handleSave(e, true)} loading={loading} icon="arrow_forward">
                        Save &amp; Continue
                    </Button>
                </div>
            </div>

            <form onSubmit={(e) => handleSave(e)} className="space-y-8">

                {/* ── 1. Personal Details ────────────────────────────────── */}
                <Section icon="person" title="Personal Details">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Full Name</label>
                            <input
                                type="text"
                                className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Your full name"
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Email Address</label>
                            <input
                                type="email"
                                className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--color-text-muted)] opacity-70 cursor-not-allowed transition-all"
                                value={email || ''}
                                readOnly
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Expected Inflation Rate (%)</label>
                            <div className="relative flex items-center">
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    step="0.5"
                                    min="0"
                                    max="30"
                                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-3 pr-10 py-2.5 text-sm text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    value={inflationRate}
                                    onChange={(e) => setInflationRate(e.target.value)}
                                    placeholder="6"
                                />
                                <span className="absolute right-3 text-[var(--color-text-muted)] font-medium text-sm select-none">%</span>
                            </div>
                        </div>
                    </div>
                </Section>

                {/* ── 2. Income Sources ──────────────────────────────────── */}
                <Section icon="payments" title="Income Sources">
                    <div className="space-y-3">
                        {incomeSources.map((item, i) => (
                            <ListRow
                                key={i}
                                nameLabel="Source Name"
                                amountLabel="Monthly Amount"
                                isValue={false}
                                item={item}
                                onChange={(field, val) => updateList(setIncomeSources, i, field, val)}
                                onDelete={() => removeFromList(setIncomeSources, i)}
                            />
                        ))}
                        <button
                            type="button"
                            onClick={() => addToList(setIncomeSources, false)}
                            className="flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:underline mt-2"
                        >
                            <Icon name="add_circle" size={18} /> Add Income Source
                        </button>
                    </div>
                </Section>

                {/* ── 3. Monthly Expenses ────────────────────────────────── */}
                <Section icon="receipt_long" title="Monthly Expenses" color="#f59e0b">
                    <div className="space-y-3">
                        {expenses.map((item, i) => (
                            <ListRow
                                key={i}
                                nameLabel="Expense Category"
                                amountLabel="Monthly Amount"
                                isValue={false}
                                item={item}
                                onChange={(field, val) => updateList(setExpenses, i, field, val)}
                                onDelete={() => removeFromList(setExpenses, i)}
                            />
                        ))}
                        <button
                            type="button"
                            onClick={() => addToList(setExpenses, false)}
                            className="flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:underline mt-2"
                        >
                            <Icon name="add_circle" size={18} /> Add Expense Category
                        </button>
                    </div>
                    <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
                        <RupeeInput
                            label="Existing EMI / Monthly Loan Payments"
                            value={existingEmi}
                            onChange={(e) => setExistingEmi(e.target.value)}
                            placeholder="0"
                        />
                        <p className="text-xs text-[var(--color-text-muted)] mt-2">
                            Total of all existing loan repayments (home loan, personal loan, etc.)
                        </p>
                    </div>
                </Section>

                {/* ── 4 & 5. Assets & Liabilities (side by side) ────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Assets */}
                    <Section icon="account_balance" title="Assets" color="#10b981">
                        <div className="space-y-3">
                            {assets.map((item, i) => (
                                <ListRow
                                    key={i}
                                    nameLabel="Asset Name"
                                    amountLabel="Value"
                                    isValue={true}
                                    item={item}
                                    onChange={(field, val) => updateList(setAssets, i, field, val)}
                                    onDelete={() => removeFromList(setAssets, i)}
                                />
                            ))}
                            <button
                                type="button"
                                onClick={() => addToList(setAssets, true)}
                                className="flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:underline mt-2"
                            >
                                <Icon name="add_circle" size={18} /> Add Asset
                            </button>
                        </div>
                    </Section>

                    {/* Liabilities */}
                    <Section icon="credit_card" title="Liabilities" color="#ef4444">
                        <div className="space-y-3">
                            {liabilities.map((item, i) => (
                                <ListRow
                                    key={i}
                                    nameLabel="Liability Name"
                                    amountLabel="Outstanding Amount"
                                    isValue={true}
                                    item={item}
                                    onChange={(field, val) => updateList(setLiabilities, i, field, val)}
                                    onDelete={() => removeFromList(setLiabilities, i)}
                                />
                            ))}
                            <button
                                type="button"
                                onClick={() => addToList(setLiabilities, true)}
                                className="flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:underline mt-2"
                            >
                                <Icon name="add_circle" size={18} /> Add Liability
                            </button>
                        </div>
                    </Section>
                </div>

                {/* Footer Actions */}
                <div className="pt-10 flex flex-col md:flex-row gap-4 items-center justify-between border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-3 text-[var(--color-text-muted)] italic text-sm">
                        <Icon name="verified" className="text-[var(--color-primary)]" size={16} />
                        <span>Your financial data is stored securely.</span>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" type="button" onClick={(e) => handleSave(e)} loading={loading}>
                            Save Changes
                        </Button>
                        <Button type="button" onClick={(e) => handleSave(e, true)} loading={loading} icon="arrow_forward">
                            Save &amp; Continue
                        </Button>
                    </div>
                </div>
            </form>
        </motion.div>
    );
}
