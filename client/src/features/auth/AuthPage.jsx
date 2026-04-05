import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, registerUser, clearError } from './authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import logo from '../../assets/logo.png';

// Subtle SVG chart lines for the left panel background
function ChartBackground() {
    return (
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 400 500" preserveAspectRatio="none">
            <polyline points="0,400 60,350 120,300 180,320 240,250 300,200 360,180 400,120" fill="none" stroke="currentColor" strokeWidth="2"/>
            <polyline points="0,450 80,400 160,420 240,360 320,340 400,280" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <polyline points="0,480 100,460 200,440 300,400 400,380" fill="none" stroke="currentColor" strokeWidth="1"/>
            <circle cx="60" cy="350" r="4" fill="currentColor"/>
            <circle cx="240" cy="250" r="4" fill="currentColor"/>
            <circle cx="360" cy="180" r="4" fill="currentColor"/>
        </svg>
    );
}

export default function AuthPage() {
    const location = useLocation();
    const initialMode = location.pathname === '/register' ? 'signup' : 'login';
    const [mode, setMode] = useState(initialMode);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [confirm, setConfirm] = useState('');
    const [localError, setLocalError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((s) => s.auth);

    useEffect(() => { if (token) navigate('/'); }, [token, navigate]);
    useEffect(() => {
        dispatch(clearError());
        setLocalError('');
    }, [mode, dispatch]);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        if (password !== confirm) {
            setLocalError('Passwords do not match');
            return;
        }
        if (fullName.trim().length < 2) {
            setLocalError('Please enter your full name');
            return;
        }
        setLocalError('');
        dispatch(registerUser({ full_name: fullName.trim(), email, password }));
    };

    const displayError = localError || error;

    return (
        <div className="auth-page-wrapper min-h-screen flex bg-[var(--color-bg)]">
            {/* ── Left Branding Panel ───────────────────────────────── */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] bg-[var(--color-surface)] border-r border-[var(--color-border)] p-12 relative overflow-hidden text-[var(--color-primary)]">
                <ChartBackground />

                <div className="relative z-10 mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <img src={logo} alt="FinSim Logo" className="w-10 h-10 object-contain shrink-0" />
                        <span className="text-white font-semibold text-lg">FinSim</span>
                    </div>
                    <p className="text-xs text-gray-400 tracking-wide uppercase">
                        FINANCIAL SCENARIO SIMULATOR
                    </p>
                </div>

                <div className="relative z-10 space-y-6">
                    <h2 className="text-4xl font-black text-[var(--color-text)] leading-tight">
                        Simulate your financial future before it happens.
                    </h2>
                    <p className="text-[var(--color-text-secondary)] text-base leading-relaxed">
                        Understand how financial shocks and major decisions affect your financial stability — with deterministic, real-data simulations.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        {[
                            { label: 'Shock Simulator', desc: 'Job loss, market crash, medical emergencies' },
                            { label: 'Decision Simulator', desc: 'Loans, purchases, EMI impact analysis' },
                            { label: 'Resilience Score', desc: 'Financial health composite scoring' },
                            { label: 'Smart Insights', desc: 'Rule-based deterministic recommendations' },
                        ].map((f) => (
                            <div key={f.label} className="p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]">
                                <p className="text-xs font-bold text-[var(--color-primary)]">{f.label}</p>
                                <p className="text-[11px] text-[var(--color-text-muted)] mt-1">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 text-[11px] text-[var(--color-text-muted)]">
                    FinSim — Financial Scenario Simulator v1.0
                </p>
            </div>

            {/* ── Right Auth Form ──────────────────────────────────── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            <div className="text-center lg:hidden mb-8">
                                <div className="flex items-center justify-center gap-3 mb-2">
                                    <img src={logo} alt="FinSim Logo" className="w-10 h-10 object-contain shrink-0" />
                                    <span className="text-white font-semibold text-lg">FinSim</span>
                                </div>
                                <p className="text-xs text-gray-400 tracking-wide uppercase">FINANCIAL SCENARIO SIMULATOR</p>
                            </div>

                            <div className="hidden lg:block">
                                <h1 className="text-3xl font-bold text-[var(--color-text)]">
                                    {mode === 'login' ? 'Welcome back' : 'Create account'}
                                </h1>
                                <p className="mt-1 text-[var(--color-text-secondary)]">
                                    {mode === 'login' ? 'Sign in to your FinSim account' : 'Get started with FinSim'}
                                </p>
                            </div>

                            <form
                                onSubmit={mode === 'login' ? handleLoginSubmit : handleSignupSubmit}
                                className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-lg)] p-8 space-y-5"
                            >
                                {displayError && (
                                    <div className="p-3 rounded-lg bg-[var(--color-danger)]/10 text-[var(--color-danger)] text-sm">
                                        {displayError}
                                    </div>
                                )}

                                {mode === 'signup' && (
                                    <div className="space-y-2">
                                        <label htmlFor="reg-fullname" className="block text-sm font-medium text-[var(--color-text-secondary)]">Full Name</label>
                                        <input
                                            id="reg-fullname"
                                            type="text"
                                            placeholder="Jane Smith"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            required
                                            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label htmlFor="auth-email" className="block text-sm font-medium text-[var(--color-text-secondary)]">Email</label>
                                    <input
                                        id="auth-email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="auth-password" className="block text-sm font-medium text-[var(--color-text-secondary)]">Password</label>
                                    <input
                                        id="auth-password"
                                        type="password"
                                        placeholder={mode === 'login' ? '••••••••' : 'Min 6 characters'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
                                    />
                                </div>

                                {mode === 'signup' && (
                                    <div className="space-y-2">
                                        <label htmlFor="reg-confirm" className="block text-sm font-medium text-[var(--color-text-secondary)]">Confirm Password</label>
                                        <input
                                            id="reg-confirm"
                                            type="password"
                                            placeholder="Re-enter password"
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                            required
                                            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
                                        />
                                    </div>
                                )}

                                <Button type="submit" loading={loading} className="w-full">
                                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                                </Button>

                                <div className="text-center text-sm text-[var(--color-text-secondary)]">
                                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                                    <button
                                        type="button"
                                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                        className="text-[var(--color-primary)] font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
                                    >
                                        {mode === 'login' ? 'Create Account' : 'Sign in'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
