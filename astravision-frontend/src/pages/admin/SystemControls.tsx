import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Activity, Wifi, AlertTriangle, Play, CheckCircle, XCircle } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

const SystemControls = () => {
    const { systemMode, setSystemMode } = useSystem();
    const [isPatrolling, setIsPatrolling] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);

    useEffect(() => {
        if (systemMode === 'INACTIVE') {
            setIsPatrolling(false);
        }
    }, [systemMode]);

    const handleDeactivate = () => {
        setSystemMode('INACTIVE');
        setShowDeactivateModal(false);
        console.log("System Deactivated by Admin");
    };

    const handleActivate = () => {
        setSystemMode('ACTIVE');
    };

    return (
        <div className="space-y-6 container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div className="relative">
                    <h1 className="text-3xl font-extrabold text-white tracking-widest relative inline-block">
                        SYSTEM CONTROLS
                        <motion.div
                            className="absolute -bottom-2 left-0 h-0.5 bg-neon-cyan"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1 }}
                        />
                    </h1>
                </div>

                <div className={`flex items-center space-x-3 px-4 py-2 rounded-full border transition-all duration-500 ${systemMode === 'ACTIVE' ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-neon-red/10 border-neon-red/50 shadow-[0_0_15px_rgba(255,50,50,0.2)]'}`}>
                    <span className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-lg ${systemMode === 'ACTIVE' ? 'bg-green-500 shadow-green-500/50' : 'bg-neon-red shadow-neon-red/50'}`} />
                    <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${systemMode === 'ACTIVE' ? 'text-green-500' : 'text-neon-red'}`}>
                        {systemMode === 'ACTIVE' ? 'System Active' : 'System Deactivated'}
                    </span>
                </div>
            </div>

            <AnimatePresence>
                {systemMode === 'INACTIVE' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-neon-red/10 border border-neon-red/50 rounded-lg p-3 flex items-center space-x-3 mb-6"
                    >
                        <AlertTriangle className="w-5 h-5 text-neon-red flex-shrink-0 animate-pulse" />
                        <p className="text-neon-red text-xs font-mono uppercase tracking-wider font-bold">
                            System is currently deactivated. Autonomous operations paused.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patrol Operations */}
                <div className={`glass-card p-6 border-dark-border transition-all duration-300 ${systemMode === 'INACTIVE' ? 'opacity-40 grayscale' : 'hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]'}`}>
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center uppercase tracking-widest">
                        <Play className="w-4 h-4 mr-2 text-neon-cyan" />
                        Patrol Operations
                    </h2>
                    <div className="flex flex-col space-y-4">
                        <button
                            title={systemMode === 'INACTIVE' ? 'System must be activated before starting patrol.' : ''}
                            disabled={systemMode === 'INACTIVE' || isPatrolling}
                            onClick={() => setIsPatrolling(true)}
                            className={`w-full py-4 px-4 rounded font-bold uppercase tracking-widest transition-all border flex items-center justify-center space-x-2 ${isPatrolling ? 'bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan' : 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black shadow-[0_0_10px_rgba(0,240,255,0.1)]'}`}
                        >
                            <Activity className={`w-4 h-4 ${isPatrolling ? 'animate-spin' : ''}`} />
                            <span>{isPatrolling ? 'Patrol Active' : 'Start Patrol'}</span>
                        </button>

                        <button
                            disabled={!isPatrolling}
                            onClick={() => setIsPatrolling(false)}
                            className={`w-full py-4 px-4 rounded font-bold uppercase tracking-widest transition-all border ${isPatrolling ? 'bg-dark-surface border-gray-600 text-gray-400 hover:text-white hover:border-gray-400' : 'bg-dark-surface border-gray-800 text-gray-600 cursor-not-allowed'}`}
                        >
                            Stop Patrol
                        </button>
                    </div>
                    {systemMode === 'INACTIVE' && (
                        <p className="text-[10px] text-neon-red font-mono uppercase tracking-widest mt-4 text-center">
                            System must be activated before starting patrol.
                        </p>
                    )}
                </div>

                {/* System Mode Control */}
                <div className={`glass-card p-6 border transition-all duration-500 ${systemMode === 'ACTIVE' ? 'border-neon-cyan shadow-[0_0_20px_rgba(0,240,255,0.1)]' : 'border-neon-red shadow-[0_0_20px_rgba(255,50,50,0.1)]'}`}>
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-white uppercase tracking-widest">System Mode</h2>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-mono">Autonomous Operation State Management</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <button
                            onClick={handleActivate}
                            className={`group relative overflow-hidden py-4 px-4 rounded border font-bold uppercase tracking-widest transition-all flex items-center justify-between ${systemMode === 'ACTIVE' ? 'bg-neon-cyan text-black border-neon-cyan' : 'bg-transparent border-dark-border text-gray-500 hover:border-neon-cyan/50 hover:text-neon-cyan'}`}
                        >
                            <span className="relative z-10 flex items-center">
                                <CheckCircle className={`w-4 h-4 mr-2 ${systemMode === 'ACTIVE' ? 'text-black' : 'text-gray-600 group-hover:text-neon-cyan'}`} />
                                Activate System
                            </span>
                            {systemMode === 'ACTIVE' && <motion.div layoutId="active-indicator" className="w-2 h-2 rounded-full bg-black animate-pulse" />}
                        </button>

                        <button
                            onClick={() => systemMode === 'ACTIVE' ? setShowDeactivateModal(true) : null}
                            className={`group relative overflow-hidden py-4 px-4 rounded border font-bold uppercase tracking-widest transition-all flex items-center justify-between ${systemMode === 'INACTIVE' ? 'bg-neon-red text-black border-neon-red' : 'bg-transparent border-dark-border text-gray-500 hover:border-neon-red/50 hover:text-neon-red'}`}
                        >
                            <span className="relative z-10 flex items-center">
                                <XCircle className={`w-4 h-4 mr-2 ${systemMode === 'INACTIVE' ? 'text-black' : 'text-gray-600 group-hover:text-neon-red'}`} />
                                Deactivate System
                            </span>
                            {systemMode === 'INACTIVE' && <motion.div layoutId="active-indicator" className="w-2 h-2 rounded-full bg-black animate-pulse" />}
                        </button>
                    </div>
                </div>

                <div className={`glass-card p-6 border-dark-border md:col-span-2 transition-opacity duration-300 ${systemMode === 'INACTIVE' ? 'opacity-30' : ''}`}>
                    <h2 className="text-lg font-bold text-white mb-6 flex items-center uppercase tracking-widest">
                        <Activity className="w-4 h-4 mr-2 text-neon-green" />
                        Sensor Interface
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((sensor) => (
                            <div key={sensor} className="bg-dark-surface/50 border border-dark-border p-4 rounded flex items-center justify-between group hover:border-neon-green/30 transition-colors">
                                <span className="text-gray-400 font-mono text-xs uppercase tracking-widest">Sensor 0{sensor}</span>
                                <Wifi className={`w-4 h-4 text-neon-green ${systemMode === 'ACTIVE' ? 'animate-pulse' : 'opacity-20'}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showDeactivateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-dark-base border border-neon-red/50 p-8 max-w-md w-full relative overflow-hidden rounded-lg"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-red to-transparent shadow-[0_0_15px_rgba(255,50,50,0.5)]" />

                            <h3 className="text-white font-bold uppercase tracking-[0.2em] text-xl mb-4 flex items-center">
                                <ShieldAlert className="w-6 h-6 mr-3 text-neon-red" />
                                Confirm System Deactivation
                            </h3>

                            <p className="text-gray-400 font-mono text-sm leading-relaxed mb-8">
                                <span className="text-neon-red font-bold">WARNING:</span> This will pause all active patrol operations and suspend autonomous threat detection. Continue with system suspension?
                            </p>

                            <div className="flex justify-end items-center space-x-6">
                                <button
                                    onClick={() => setShowDeactivateModal(false)}
                                    className="text-gray-500 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeactivate}
                                    className="py-3 px-8 bg-neon-red/10 border border-neon-red text-neon-red font-bold uppercase tracking-widest text-xs hover:bg-neon-red hover:text-black transition-all shadow-[0_0_15px_rgba(255,50,50,0.2)]"
                                >
                                    Confirm Deactivation
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SystemControls;
