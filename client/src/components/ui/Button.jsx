import Icon from './Icon';

export default function Button({ children, variant = 'primary', className = '', loading = false, icon, ...props }) {
    const base = 'inline-flex items-center justify-center gap-2 font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none';

    const variants = {
        primary: 'px-6 py-3 bg-[var(--color-primary)] text-[#000000] rounded-xl hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] shadow-[0_0_20px_rgba(34,211,238,0.15)]',
        secondary: 'px-5 py-2.5 rounded-xl border border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10',
        danger: 'px-5 py-2.5 rounded-xl bg-[var(--color-danger)] text-white hover:opacity-90',
        ghost: 'px-3 py-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]',
    };

    return (
        <button
            className={`${base} ${variants[variant] || variants.primary} ${className}`}
            disabled={loading || props.disabled}
            {...props}
        >
            {loading && (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                </svg>
            )}
            {icon && !loading && <Icon name={icon} size={18} />}
            {children}
        </button>
    );
}
