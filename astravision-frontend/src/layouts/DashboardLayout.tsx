import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Home, Sliders, Activity, ShieldAlert, Menu } from 'lucide-react';
import { useState } from 'react';
import NeuralNetworkBackground from '../components/NeuralNetworkBackground';

const SidebarLink = ({ to, icon: Icon, label, isActive }: { to: string; icon: any; label: string; isActive: boolean }) => (
    <Link
        to={to}
        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${isActive
            ? 'glass-card bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan shadow-neon-cyan'
            : 'text-gray-400 hover:text-white hover:bg-dark-surface hover:shadow-md'
            }`}
    >
        <Icon className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
        <span className="font-medium">{label}</span>
    </Link>
);

const DashboardLayout = ({ role }: { role: 'user' | 'admin' }) => {
    const { logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
    };

    const navItems = [
        { to: `/${role}/dashboard`, icon: Activity, label: 'Live Monitoring' },
        // more links can be added here
    ];

    if (role === 'admin') {
        navItems.push({ to: '/admin/settings', icon: Sliders, label: 'System Control' });
    }

    return (
        <div className="min-h-screen bg-transparent flex flex-col md:flex-row text-gray-100 overflow-hidden">
            <NeuralNetworkBackground />
            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: isSidebarOpen ? 0 : -300 }}
                className={`fixed md:relative z-40 w-64 h-screen border-r border-dark-border glass-panel flex flex-col transition-transform`}
            >
                <div className="p-6 flex items-center justify-between border-b border-dark-border">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <ShieldAlert className="w-8 h-8 text-neon-red animate-pulse-glow rounded-full" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-red to-orange-500 tracking-wide">
                            {role === 'admin' ? 'SYS.ADMIN' : 'SYS.USER'}
                        </span>
                    </Link>
                </div>

                <nav className="flex-grow py-6 px-4 space-y-2">
                    {navItems.map((item) => (
                        <SidebarLink
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            label={item.label}
                            isActive={location.pathname === item.to}
                        />
                    ))}
                </nav>

                <div className="p-4 border-t border-dark-border space-y-2">
                    <Link
                        to="/"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-dark-surface transition-all"
                    >
                        <Home className="w-5 h-5" />
                        <span className="font-medium">Public Site</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-neon-red border border-neon-red/30 hover:bg-neon-red/10 animate-border-pulse transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="font-bold">Terminate Session</span>
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Top bar for mobile */}
                <div className="md:hidden glass-panel border-b border-dark-border p-4 flex justify-between items-center z-30">
                    <span className="font-bold text-neon-cyan">AstraVision Dashboard</span>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                        <Menu className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Real Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scrollbar-custom">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3 }}
                            className="h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Mobile backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default DashboardLayout;
