import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
const MainLayout = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    return (
        <div className={`min-h-screen ${isAuthenticated ? 'bg-transparent' : 'bg-dark-base'} flex flex-col relative text-slate-300 font-sans`}>
            <Navbar />


            <main className="flex-grow pt-16 z-10 relative bg-transparent">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full bg-transparent"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            <footer className="border-t border-dark-border/50 bg-dark-surface/50 backdrop-blur-md z-10">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} AstraVision. Final Year Robotics Project.</p>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        {isAuthenticated && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex items-center space-x-2 px-3 py-1 rounded-full glass-panel border-dark-border/50"
                            >
                                <span className="w-2 h-2 rounded-full bg-neon-green animate-breathing shadow-neon-green" />
                                <span className="text-[11px] font-bold tracking-wider uppercase text-gray-300">System Online</span>
                            </motion.span>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
