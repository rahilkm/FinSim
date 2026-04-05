import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--color-bg)]">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 flex flex-col overflow-hidden">
                <Navbar onMenuClick={() => setSidebarOpen(true)} />

                <div className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
