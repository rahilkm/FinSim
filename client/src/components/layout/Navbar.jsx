import { useState, useEffect } from 'react';
import Icon from '../ui/Icon';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ onMenuClick }) {
    const { user } = useSelector((s) => s.auth);
    const navigate = useNavigate();
    const location = useLocation();

    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsCollapsed(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        // check on mount
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const profile = JSON.parse(localStorage.getItem("userProfile") || "{}");

    const userName =
        localStorage.getItem("userName") ||
        profile.fullName ||
        user?.name ||
        "User";

    const userEmail =
        profile.email ||
        user?.email ||
        "";

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('dashboard')) return 'Dashboard';
        if (path.includes('shock')) return 'Shock Analysis';
        if (path.includes('decision')) return 'Decision Analysis';
        if (path.includes('resilience')) return 'Resilience Engine';
        if (path.includes('profile')) return 'Profile Setup';
        return 'Dashboard';
    };

    return (
        <div className="navbar-wrapper">
            <header className={`navbar flex items-center justify-between px-6 transition-all duration-300 ease-in-out ${isCollapsed ? 'h-[56px] py-1' : 'h-[72px] py-3'}`}>
                {/* Left side: Mobile menu & Title */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] transition-colors duration-200"
                        aria-label="Toggle sidebar"
                    >
                        <Icon name="menu" />
                    </button>

                    {/* App title */}
                    <h1 className={`font-bold text-[var(--color-text)] transition-all duration-300 ease-in-out ${isCollapsed ? 'text-lg' : 'text-xl'}`}>
                        {getPageTitle()}
                    </h1>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Right side: user */}
                <div className="flex items-center gap-4">
                    {/* User info */}
                    <div 
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate('/profile')}
                    >
                        <div className="text-right hidden sm:block">
                            <span className={`text-[var(--color-text)] font-medium transition-all duration-300 ${isCollapsed ? 'text-sm' : 'text-base'}`}>
                                {userName}
                            </span>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100'}`}>
                                {userEmail && (
                                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{userEmail}</p>
                                )}
                            </div>
                        </div>
                        <div className={`rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center border border-[var(--color-border)] group-hover:border-[var(--color-primary)] transition-all duration-300 ease-in-out ${isCollapsed ? 'w-8 h-8' : 'w-10 h-10'}`}>
                            <Icon name="person" className={`transition-colors duration-300 ${isCollapsed ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-primary)]'}`} size={isCollapsed ? 18 : 20} />
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}
