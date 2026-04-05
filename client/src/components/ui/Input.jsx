export default function Input({ label, id, error, className = '', prefix, suffix, ...props }) {
    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-secondary)]">
                    {label}
                </label>
            )}
            <div className="relative group">
                {prefix && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)] font-bold text-sm">
                        {prefix}
                    </span>
                )}
                <input
                    id={id}
                    className={`w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl py-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all group-hover:border-[var(--color-primary)]/40 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${prefix ? 'pl-10 pr-4' : suffix ? 'pl-4 pr-10' : 'px-4'
                        } ${error ? 'border-[var(--color-danger)]' : ''}`}
                    {...props}
                />
                {suffix && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)]/60 font-bold text-sm">
                        {suffix}
                    </span>
                )}
            </div>
            {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
        </div>
    );
}
