import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../ui/Icon';
import logo from '../../assets/logo.png';

const links = [
    { to: '/', icon: 'dashboard', label: 'Financial Overview' },
    { to: '/shock', icon: 'bolt', label: 'Shock Simulator' },
    { to: '/decision', icon: 'account_tree', label: 'Decision Simulator' },
];

const accountLinks = [
    { to: '/profile', icon: 'person', label: 'Financial Profile' },
];

function SidebarContent({ onClose, onLogout, showCloseBtn }) {
    return (
        <>
            {/* Logo */}
            <div className="px-4 py-3 flex items-center gap-3 group relative mb-4">
                <img src={logo} alt="FinSim Logo" className="w-8 h-8 object-contain shrink-0 transition-transform duration-300 group-hover:scale-[1.02]" />
                <div className="flex flex-col justify-center gap-0.5">
                    <h1 className="text-white font-semibold text-sm leading-none tracking-tight font-sans">FinSim</h1>
                    <p className="text-xs text-gray-400 leading-none">Financial Simulator</p>
                </div>
                {showCloseBtn && (
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-1.5 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] transition-colors"
                        aria-label="Close menu"
                    >
                        <Icon name="close" size={20} />
                    </button>
                )}
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {links.map(({ to, icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to === '/'}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive
                                ? 'bg-[rgba(34,211,238,0.12)] text-[#22d3ee] border border-[#22d3ee] font-semibold'
                                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] font-medium'
                            }`
                        }
                    >
                        <Icon name={icon} />
                        {label}
                    </NavLink>
                ))}

                {/* Account section */}
                <div className="pt-6 pb-2 text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] px-3">
                    Account
                </div>
                {accountLinks.map(({ to, icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${isActive
                                ? 'bg-[rgba(34,211,238,0.12)] text-[#22d3ee] border border-[#22d3ee] font-semibold'
                                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)] font-medium'
                            }`
                        }
                    >
                        <Icon name={icon} />
                        {label}
                    </NavLink>
                ))}

                <button
                    onClick={onLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-all"
                >
                    <Icon name="logout" />
                    Logout
                </button>
            </nav>

            {/* Version tag — replaced Upgrade widget */}
            <div className="p-4">
                <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-4">
                    <p className="text-xs font-semibold text-[var(--color-primary)] mb-1">FinSim v1.0</p>
                    <p className="text-[11px] text-[var(--color-text-muted)] leading-tight">
                        Financial Scenario Simulator — deterministic analysis engine.
                    </p>
                </div>
            </div>
        </>
    );
}

export default function Sidebar({ open, onClose }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/auth');
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className="hidden lg:flex flex-col h-full border-r border-[var(--color-border)] bg-[var(--color-bg)]"
                style={{ width: 'var(--sidebar-width)', minWidth: 'var(--sidebar-width)' }}
            >
                <SidebarContent onClose={onClose} onLogout={handleLogout} />
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="mobile-sidebar"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 lg:hidden"
                    >
                        <div className="absolute inset-0 bg-black/40" onClick={onClose} />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-out border-r border-[var(--color-border)] bg-[var(--color-bg)] ${open ? 'translate-x-0' : '-translate-x-full'}`}
                        >
                            <SidebarContent onClose={onClose} onLogout={handleLogout} showCloseBtn />
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
