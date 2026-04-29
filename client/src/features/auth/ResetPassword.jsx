import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import api from '../../app/api';
import logo from '../../assets/logo.png';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (password !== confirm) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', { token, password });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. The link may have expired.');
        } finally {
            setLoading(false);
        }
    };

    // No token in URL
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center space-y-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <img src={logo} alt="FinSim Logo" className="w-10 h-10 object-contain" />
                        <span className="text-white font-semibold text-lg">FinSim</span>
                    </div>

                    <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-8 space-y-4">
                        <div className="w-14 h-14 mx-auto rounded-full bg-[var(--color-danger)]/10 flex items-center justify-center">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-[var(--color-text)]">Invalid Reset Link</h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            This password reset link is invalid or missing a token. Please request a new one.
                        </p>
                        <Link
                            to="/auth"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)] hover:underline"
                        >
                            ← Back to Sign In
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Success state
    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-6">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md text-center space-y-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <img src={logo} alt="FinSim Logo" className="w-10 h-10 object-contain" />
                        <span className="text-white font-semibold text-lg">FinSim</span>
                    </div>

                    <div className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] p-8 space-y-5">
                        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-[var(--color-text)]">Password Reset!</h2>
                        <p className="text-sm text-[var(--color-text-secondary)]">
                            Your password has been updated successfully. You can now sign in with your new password.
                        </p>
                        <Button onClick={() => navigate('/auth')} className="w-full">
                            Sign In
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Reset form
    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md space-y-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <img src={logo} alt="FinSim Logo" className="w-10 h-10 object-contain" />
                    <span className="text-white font-semibold text-lg">FinSim</span>
                </div>

                <div className="text-center">
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Set New Password</h1>
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        Enter your new password below
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-[var(--shadow-lg)] p-8 space-y-5"
                >
                    {error && (
                        <div className="p-3 rounded-lg bg-[var(--color-danger)]/10 text-[var(--color-danger)] text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="new-password" className="block text-sm font-medium text-[var(--color-text-secondary)]">New Password</label>
                        <input
                            id="new-password"
                            type="password"
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-[var(--color-text-secondary)]">Confirm Password</label>
                        <input
                            id="confirm-password"
                            type="password"
                            placeholder="Re-enter password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                            className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 transition-all"
                        />
                    </div>

                    <Button type="submit" loading={loading} className="w-full">
                        Reset Password
                    </Button>

                    <div className="text-center">
                        <Link
                            to="/auth"
                            className="text-sm text-[var(--color-primary)] font-semibold hover:underline"
                        >
                            ← Back to Sign In
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
