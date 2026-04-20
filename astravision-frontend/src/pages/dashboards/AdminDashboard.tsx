import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useSystem } from '../../context/SystemContext';
import {
    Settings, Cpu, Sliders, Users, Battery, Wifi, Clock, ShieldAlert, AlertTriangle
} from 'lucide-react';

const ControlPanel = ({ title, icon: Icon, children, className = '' }: any) => (
    <div className={`glass-card border border-dark-border p-5 relative overflow-hidden group hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(0,240,255,0.05)] transition-all duration-300 ${className}`}>
        <div className="flex items-center space-x-2 text-white mb-4 border-b border-dark-border pb-3 group-hover:border-neon-cyan/50 transition-colors">
            <Icon className="w-5 h-5 text-neon-cyan group-hover:animate-pulse group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] transition-all" />
            <h3 className="font-bold uppercase tracking-wider text-sm text-gray-200 group-hover:text-white transition-colors">{title}</h3>
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);



const AdminDashboard = () => {
    const { systemMode } = useSystem();
    const [patrolActive, setPatrolActive] = useState(true);
    const [mlEnabled, setMlEnabled] = useState(true);
    const [testMode, setTestMode] = useState(false);
    const [mlThreshold] = useState(85);
    interface RobotMetrics {
        uptime: string;
        cpu_load: number;
        battery_voltage: number;
        wifi_signal: number;
    }

    const [metrics, setMetrics] = useState<RobotMetrics | null>(null);
    const [alerts, setAlerts] = useState<any[]>([]);
    const uptime = metrics?.uptime || '--:--:--';
    const [confirmAction, setConfirmAction] = useState<null | 'stop-motors'>(null);
    const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));


    interface Identity {
        id: string;
        name: string;
        email: string;
        role: 'Admin' | 'Operator' | 'Viewer';
        password?: string;
        status: 'Active' | 'Inactive';
    }

    const [users, setUsers] = useState<Identity[]>([]);

    const loadUsers = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/users");
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error("Failed to load users:", err);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        const fetchSystemData = async () => {
            try {
                // Fetch Metrics
                const metricsRes = await fetch("http://localhost:5000/api/metrics");
                const metricsData = await metricsRes.json();
                setMetrics(metricsData);

                // Fetch Alerts
                const alertsRes = await fetch("http://localhost:5000/api/alerts");
                const alertsData = await alertsRes.json();
                setAlerts(alertsData);
                setLastSync(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
            } catch (error) {
                console.error("Error fetching system data:", error);
            }
        };
        fetchSystemData();
        const interval = setInterval(fetchSystemData, 5000);
        return () => clearInterval(interval);
    }, []);

    const totalUsersCount = users.length;
    const activeUsersCount = users.filter(u => u.status.toLowerCase() === 'active').length;
    const adminCount = users.filter(u => u.role.toLowerCase() === 'admin').length;
    const criticalAlarmsCount = alerts.filter(a => a.severity === 'CRITICAL').length;

    return (
        <div className="max-w-7xl mx-auto space-y-4 pb-20 p-2 md:p-6 h-full overflow-y-auto custom-scrollbar relative">

            <AnimatePresence>


                {confirmAction && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-dark-base border border-neon-red/50 shadow-[0_0_30px_rgba(255,50,50,0.15)] p-6 max-w-sm w-full relative before:absolute before:inset-0 before:border before:border-neon-red/20 before:animate-pulse pointer-events-auto"
                        >
                            <h3 className="text-neon-red font-bold uppercase tracking-widest text-lg mb-2">Confirm Action</h3>
                            <p className="text-gray-300 font-mono text-sm mb-6">This action will interrupt active system processes. Continue?</p>
                            <div className="flex justify-end space-x-4 relative z-10">
                                <button
                                    onClick={() => setConfirmAction(null)}
                                    className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (confirmAction === 'stop-motors') setPatrolActive(!patrolActive);
                                        setConfirmAction(null);
                                    }}
                                    className="px-4 py-2 text-xs font-bold tracking-widest uppercase bg-neon-red/20 text-neon-red border border-neon-red hover:bg-neon-red hover:text-black transition-all shadow-[0_0_10px_rgba(255,50,50,0.2)]"
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-4 mt-4 md:mt-0">
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                        <h1 className="text-3xl font-extrabold text-white tracking-widest relative inline-block w-fit">
                            SYSTEM CONTROL CENTER
                            <motion.div
                                className="absolute -bottom-2 left-0 h-0.5 bg-neon-cyan"
                                initial={{ width: 0 }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 1 }}
                            />
                        </h1>
                        <div className={`flex items-center space-x-2 border px-3 py-1.5 rounded-full self-start ml-3 transition-all duration-500 ${systemMode === 'ACTIVE' ? 'bg-green-500/10 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.1)]' : 'bg-neon-red/10 border-neon-red/50 shadow-[0_0_10px_rgba(255,50,50,0.1)]'}`}>
                            <span className={`w-2 h-2 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)] ${systemMode === 'ACTIVE' ? 'bg-green-500' : 'bg-neon-red'}`} />
                            <span className={`text-[10px] font-bold tracking-widest uppercase ${systemMode === 'ACTIVE' ? 'text-green-500' : 'text-neon-red'}`}>
                                {systemMode === 'ACTIVE' ? 'System Active' : 'System Deactivated'}
                            </span>
                        </div>
                    </div>
                    <span className="text-neon-cyan/80 text-sm font-mono tracking-widest uppercase mt-4 block">
                        Administrative Command Interface
                    </span>

                    <AnimatePresence>
                        {systemMode === 'INACTIVE' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-neon-red/10 border border-neon-red/50 rounded-lg p-3 flex items-center space-x-3 mt-4"
                            >
                                <AlertTriangle className="w-5 h-5 text-neon-red flex-shrink-0 animate-pulse" />
                                <p className="text-neon-red text-xs font-mono uppercase tracking-wider font-bold">
                                    System is currently deactivated. Autonomous operations paused.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Header Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel p-4 flex items-center justify-between border-l-2 border-dark-border hover:bg-white/5 hover:border-gray-500 transition-colors group">
                    <div><p className="text-[10px] text-gray-500 uppercase tracking-widest">Sys Uptime</p><p className="font-mono text-gray-300 text-lg font-bold group-hover:text-white transition-colors">{uptime}</p></div>
                    <Clock className="text-gray-500 w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:text-gray-300 transition-all" />
                </div>
                <div className="glass-panel p-4 flex items-center justify-between border-l-2 border-dark-border hover:bg-white/5 hover:border-neon-blue transition-colors group">
                    <div><p className="text-[10px] text-gray-500 uppercase tracking-widest">CPU Load</p><p className="font-mono text-gray-300 text-lg font-bold group-hover:text-white transition-colors">{metrics?.cpu_load ?? 0}%</p></div>
                    <Cpu className="text-gray-500 w-5 h-5 opacity-50 group-hover:opacity-100 group-hover:text-neon-blue transition-all" />
                </div>
                <div className="glass-panel p-4 flex items-center justify-between border-l-4 border-neon-green/80 hover:border-neon-green hover:shadow-[0_0_15px_rgba(50,255,50,0.1)] transition-all group duration-300 hover:-translate-y-0.5">
                    <div><p className="text-xs text-neon-green/80 uppercase tracking-widest font-bold drop-shadow-[0_0_2px_rgba(50,255,50,0.5)]">Bat. Voltage</p><p className="font-mono text-white text-xl font-bold group-hover:text-neon-green transition-colors">{metrics?.battery_voltage ?? 0}V</p></div>
                    <Battery className="text-neon-green/80 w-6 h-6 drop-shadow-[0_0_5px_rgba(50,255,50,0.5)] group-hover:text-neon-green transition-all" />
                </div>
                <div className="glass-panel p-4 flex items-center justify-between border-l-4 border-purple-500/80 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all group duration-300 hover:-translate-y-0.5">
                    <div><p className="text-xs text-purple-500/80 uppercase tracking-widest font-bold drop-shadow-[0_0_2px_rgba(168,85,247,0.5)]">WiFi Signal</p><p className="font-mono text-white text-xl font-bold group-hover:text-purple-400 transition-colors">{metrics?.wifi_signal ?? 0} dBm</p></div>
                    <Wifi className="text-purple-500/80 w-6 h-6 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)] group-hover:text-purple-400 transition-all" />
                </div>
            </div>

            <div className="text-right pb-1">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Last System Sync: {lastSync} | Server: Connected</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* System Control Panel */}
                <ControlPanel title="Core Hardware Control" icon={Settings}>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-300 font-mono text-sm">Patrol Subsystem</span>
                        <button
                            title={systemMode === 'INACTIVE' ? 'System must be activated before starting patrol.' : ''}
                            disabled={systemMode === 'INACTIVE'}
                            onClick={() => {
                                if (patrolActive) setConfirmAction('stop-motors');
                                else setPatrolActive(true);
                            }}
                            className={`px-4 py-2 rounded font-bold uppercase text-xs tracking-wider transition-colors ${systemMode === 'INACTIVE' ? 'bg-dark-surface border-dark-border text-gray-600 grayscale' : (patrolActive ? 'bg-neon-red/20 text-neon-red border border-neon-red hover:bg-neon-red hover:text-black' : 'bg-neon-green/20 text-neon-green border border-neon-green hover:bg-neon-green hover:text-black')}`}
                        >
                            {patrolActive ? 'Stop Motors' : 'Initialize Sweep'}
                        </button>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-400 font-mono">
                            <span>Servo Position</span>
                            <span className="text-neon-cyan">180°</span>
                        </div>
                        <input
                            type="range" min="0" max="180" value={180}
                            className="w-full accent-neon-cyan cursor-not-allowed opacity-50"
                            title="180°"
                            disabled
                        />
                    </div>

                </ControlPanel>

                {/* Sensor Configuration */}
                <ControlPanel title="Sensor Calibration" icon={Sliders}>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-400 font-mono">
                                <span>Ultrasonic Distance Threshold</span>
                                <span className="text-neon-blue">50 cm</span>
                            </div>
                            <input
                                title="50 cm"
                                type="range" min="0" max="5.0" step="0.1" value={0.5}
                                className="w-full accent-neon-blue cursor-not-allowed opacity-50"
                                disabled
                            />
                        </div>
                    </div>
                </ControlPanel>

                {/* ML Configuration Panel */}
                <ControlPanel title="Machine Learning Parameters" icon={Cpu}>
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-300 font-mono text-sm">Vision Engine</span>
                        <button
                            onClick={() => setMlEnabled(!mlEnabled)}
                            className={`w-12 h-6 rounded-full relative transition-all duration-300 ${mlEnabled ? 'bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.4)]' : 'bg-dark-surface border border-dark-border'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${mlEnabled ? 'translate-x-[22px]' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    <div className="space-y-2 py-2">
                        <div className="flex justify-between text-xs text-gray-400 font-mono">
                            <span>Confidence Threshold</span>
                            <span className="text-neon-cyan">{mlThreshold}%</span>
                        </div>
                        <input
                            title={`${mlThreshold}%`}
                            type="range" min="70" max="99" value={mlThreshold}
                            className="w-full accent-neon-cyan cursor-not-allowed opacity-50"
                            disabled
                        />
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-dark-border mt-4">
                        <span className="text-gray-300 font-mono text-sm">Diagnostic Mode (Mock Data)</span>
                        <button
                            onClick={() => setTestMode(!testMode)}
                            className={`px-3 py-1 rounded text-xs uppercase font-bold border transition-colors ${testMode ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-black' : 'text-gray-500 border-dark-border hover:border-gray-500'}`}
                        >
                            {testMode ? 'Active' : 'Standby'}
                        </button>
                    </div>
                </ControlPanel>

                {/* Alert Summary Panel */}
                <ControlPanel title="System Alerts Summary" icon={ShieldAlert}>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-dark-surface/50 p-3 rounded border border-dark-border hover:border-neon-cyan/50 hover:shadow-[0_0_10px_rgba(0,240,255,0.1)] transition-colors">
                            <span className="text-sm text-gray-300 font-mono">Today's Alerts</span>
                            <span className="text-neon-cyan font-bold font-mono">{alerts.length}</span>
                        </div>
                        <div className="flex justify-between items-center bg-red-500/10 p-3 rounded border border-red-500/30 hover:border-red-500/80 hover:shadow-[0_0_10px_rgba(255,50,50,0.1)] transition-colors">
                            <span className="text-sm text-red-400 font-mono">Critical Incidents</span>
                            <span className="text-neon-red font-bold font-mono">{criticalAlarmsCount}</span>
                        </div>
                        <div className="flex justify-between items-center bg-dark-surface/50 p-3 rounded border border-dark-border hover:border-neon-cyan/50 hover:shadow-[0_0_10px_rgba(0,240,255,0.1)] transition-colors">
                            <span className="text-sm text-gray-300 font-mono">False Positives</span>
                            <span className="text-gray-400 font-bold font-mono">0</span>
                        </div>
                    </div>
                </ControlPanel>
            </div>

            {/* User Management */}
            <div className="grid grid-cols-1 mt-5">
                <ControlPanel title="Identity Access Summary" icon={Users}>
                    <div className="flex items-center space-x-6 mb-4 text-[10px] uppercase font-mono tracking-widest text-gray-400 border-b border-dark-border/50 pb-3">
                        <span>Total Users: <strong className="text-white">{totalUsersCount}</strong></span>
                        <span>Active Users: <strong className="text-neon-cyan">{activeUsersCount}</strong></span>
                        <span>Administrators: <strong className="text-neon-cyan">{adminCount}</strong></span>
                    </div>

                    <div className="space-y-2">
                        <AnimatePresence>
                            {users.map(u => (
                                <motion.div
                                    key={u.id}
                                    initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                    className={`flex justify-between items-center p-2 border rounded transition-all ${u.status === 'Inactive' ? 'bg-dark-base border-dark-border opacity-50' : 'bg-dark-surface/50 border-dark-border'}`}
                                >
                                    <div className="flex flex-col">
                                        <div className="flex items-center space-x-2">
                                            <p className="text-sm text-white font-bold tracking-wide">{u.name}</p>
                                            {u.role === 'Admin' && <span className="px-1.5 py-0.5 text-[8px] font-bold text-neon-red border border-neon-red/50 bg-neon-red/10 rounded tracking-widest uppercase">Admin</span>}
                                        </div>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{u.email} • {u.role}</p>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded border ${u.status?.toLowerCase() === 'active' ? 'text-green-500 bg-green-500/10 border-green-500/20' : 'text-gray-400 bg-gray-500/10 border-gray-500/20'}`}>
                                            {u.status}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </ControlPanel>
            </div>


        </div>
    );
};

export default AdminDashboard;
