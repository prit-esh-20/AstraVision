import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X, Terminal, Cpu, ShieldAlert, Activity, LogOut, Settings, Users, Sliders, Layers, Video } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, role, logout } = useAuth();

    const publicLinks = [
        { name: 'Home', path: '/', icon: Shield },
        { name: 'Architecture', path: '/architecture', icon: Layers },
        { name: 'About', path: '/about', icon: Terminal },
    ];

    const userLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: Cpu },
        { name: 'Alerts', path: '/alerts', icon: ShieldAlert },
        { name: 'Recordings', path: '/recordings', icon: Video },
        { name: 'Logs', path: '/logs', icon: Activity },
    ];

    const adminLinks = [
        { name: 'Admin Dashboard', path: '/admin/dashboard', icon: Cpu },
        { name: 'Alerts', path: '/admin/alerts', icon: ShieldAlert },
        { name: 'Results', path: '/admin/results', icon: Activity },
        { name: 'System Controls', path: '/admin/system-controls', icon: Settings },
        { name: 'Settings', path: '/admin/settings', icon: Sliders },
        { name: 'Users', path: '/admin/user-management', icon: Users },
    ];

    const currentLinks = !isAuthenticated ? publicLinks : (role === 'admin' ? adminLinks : userLinks);

    const handleLogout = () => {
        // Call the context logout function (which handles all cleanup and navigation)
        logout();
        setIsOpen(false);
    };

    const handleDragClose = () => setIsOpen(false);

    return (
        <nav className="fixed w-full z-50 glass-panel border-b-0 border-dark-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link
                        to={!isAuthenticated ? "/" : (role === 'admin' ? "/admin/dashboard" : "/dashboard")}
                        className="flex items-center space-x-2 group"
                    >
                        <Shield className="w-8 h-8 text-neon-cyan animate-pulse-glow rounded-full" />
                        <span className="text-xl font-bold font-heading bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan to-neon-blue uppercase tracking-[0.25em] group-hover:neon-text-cyan transition-all">
                            AstraVision
                        </span>
                        {role === 'admin' && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="ml-2 px-2 py-1 flex items-center space-x-1.5 text-[10px] font-bold text-gray-300 border border-neon-red/50 bg-dark-base rounded tracking-widest shadow-[0_2px_8px_rgba(255,50,50,0.2)] uppercase"
                            >
                                <span className="w-1.5 h-1.5 rounded-full bg-neon-red animate-pulse shadow-[0_0_5px_rgba(255,50,50,0.8)]" />
                                <span>ADMIN</span>
                            </motion.span>
                        )}
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center space-x-6">
                        <AnimatePresence mode="popLayout">
                            {currentLinks.map((link) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <NavLink
                                        to={link.path}
                                        className={({ isActive }) => `relative group flex items-center space-x-1 ${isActive ? 'text-neon-cyan' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <span className="text-[10px] font-semibold font-heading uppercase tracking-[0.2em] transition-colors">
                                                    {link.name}
                                                </span>
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="nav-underline"
                                                        className="absolute -bottom-6 left-0 right-0 h-0.5 bg-neon-cyan"
                                                        initial={false}
                                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </NavLink>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isAuthenticated ? (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={handleLogout}
                                className="px-3 py-1.5 border border-neon-red text-neon-red rounded text-xs font-bold uppercase tracking-widest hover:bg-neon-red hover:text-black transition-all shadow-[0_0_10px_rgba(255,50,50,0.2)] flex items-center space-x-2"
                            >
                                <LogOut size={14} />
                                <span>Logout</span>
                            </motion.button>
                        ) : (
                            <Link
                                to="/login"
                                className="px-5 py-2 border border-neon-cyan text-neon-cyan rounded-md text-xs font-bold uppercase tracking-widest hover:bg-neon-cyan/10 transition-all neon-border-cyan whitespace-nowrap"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-400 hover:text-white focus:outline-none"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden glass-panel border-t border-dark-border overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            {currentLinks.map((link) => (
                                <NavLink
                                    key={link.name}
                                    to={link.path}
                                    onClick={handleDragClose}
                                    className={({ isActive }) => `flex items-center space-x-3 px-3 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${isActive ? 'text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/20' : 'text-gray-400 hover:text-white hover:bg-dark-surface'}`}
                                >
                                    <link.icon className="w-4 h-4" />
                                    <span className="font-heading tracking-widest">{link.name}</span>
                                </NavLink>
                            ))}

                            {isAuthenticated ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full mt-4 px-4 py-3 border border-neon-red text-neon-red rounded-xl font-bold flex items-center justify-center space-x-2 bg-neon-red/5 hover:bg-neon-red hover:text-black transition-colors"
                                >
                                    <LogOut size={16} />
                                    <span className="uppercase tracking-widest text-xs">Terminal Session</span>
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={handleDragClose}
                                    className="block w-full text-center mt-4 px-4 py-3 border border-neon-cyan text-neon-cyan rounded-xl font-bold bg-neon-cyan/5 hover:bg-neon-cyan hover:text-black transition-colors uppercase tracking-widest text-xs"
                                >
                                    Login to System
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
