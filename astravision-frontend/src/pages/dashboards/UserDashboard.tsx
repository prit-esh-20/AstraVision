import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Battery, Wifi, Clock, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const navigate = useNavigate();

    // State variables
    const [alerts, setAlerts] = useState<any[]>([]);
    const [logs, setLogs] = useState<any[]>([]);
    const [robotStatus, setRobotStatus] = useState<any>(null);

    // Derived values for UI from robotStatus if available
    const battery = robotStatus?.battery || 0;
    const mode = robotStatus?.mode || "UNKNOWN"; 
    const network = robotStatus?.network || "OFFLINE";
    const lastActivity = robotStatus?.last_activity || "No activity";

    const [fps, setFps] = useState(30);
    const [latency, setLatency] = useState(42);

    const fetchDashboardData = async () => {
        try {
            // Fetch Alerts
            const alertsRes = await fetch('http://localhost:5000/api/alerts');
            const alertsData = await alertsRes.json();
            // Map backend data to UI expectations if necessary, or just store directly
            // For now, storing directly as requested
            setAlerts(alertsData);

            // Fetch Logs
            const logsRes = await fetch('http://localhost:5000/api/logs');
            const logsData = await logsRes.json();
            setLogs(logsData);

            // Fetch Robot Status
            const statusRes = await fetch("http://localhost:5000/api/robot/status");
            const data = await statusRes.json();
            console.log(data);

            setRobotStatus({
                mode: data.status || "UNKNOWN",
                battery: data.battery || 0,
                network: "Online",
                last_activity: "Robot active",
            });
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchDashboardData();

        // Refresh every 2 seconds
        const dataInterval = setInterval(fetchDashboardData, 2000);

        // Simulation interval for FPS and Latency (remaining from existing UI)
        const simInterval = setInterval(() => {
            setFps(Math.round(28 + Math.random() * 4));
            setLatency(Math.round(40 + Math.random() * 8));
        }, 1500);

        return () => {
            clearInterval(dataInterval);
            clearInterval(simInterval);
        };
    }, []);

    // Temporary console logs to verify data is received
    useEffect(() => {
        console.log("Current Alerts:", alerts);
        console.log("Current Logs:", logs);
        console.log("Current Robot Status:", robotStatus);
    }, [alerts, logs, robotStatus]);



    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical': return <AlertTriangle className="w-4 h-4 text-neon-red" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
            case 'info': return <Info className="w-4 h-4 text-neon-cyan" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto flex flex-col">
            <div className="mb-6 lg:mb-10 text-center lg:text-left">
                <h1 className="text-2xl md:text-3xl font-bold font-heading text-white uppercase tracking-[0.1em] drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">Operator Dashboard</h1>
                <p className="text-sm text-neon-cyan/70 font-mono mt-2 tracking-wide uppercase">Secure Facilities Monitoring Console</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6 lg:gap-8 flex-grow">

                {/* CENTER COLUMN: LIVE MONITORING (Order 1 on mobile, 2 on desktop) */}
                <div className="flex flex-col space-y-4 order-1 lg:order-2 w-full lg:px-2">
                    <h2 className="text-sm font-semibold font-heading text-white uppercase tracking-[0.2em] flex items-center pl-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan mr-3 shadow-[0_0_10px_rgba(0,240,255,0.8)] animate-pulse"></span>
                        Live Monitoring
                    </h2>

                    <div className="group relative rounded-2xl overflow-hidden aspect-video bg-[#0b1220] flex items-center justify-center border border-neon-cyan/30 shadow-[0_0_30px_rgba(0,240,255,0.1)] transition-all duration-500 hover:border-neon-cyan/60 hover:shadow-[0_0_40px_rgba(0,240,255,0.2)]">
                        {/* Status Overlay Top */}
                        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-30 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
                            <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-neon-cyan/20 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                                <span className="w-2.5 h-2.5 rounded-full bg-neon-green shadow-[0_0_8px_rgba(0,255,100,0.8)] animate-pulse" />
                                <span className="text-white font-mono font-bold tracking-widest text-xs uppercase">
                                    LIVE – SEC-01
                                </span>
                            </div>
                            <div className="flex space-x-2">
                                <span className="text-[10px] font-mono font-bold text-neon-cyan bg-black/60 backdrop-blur-sm border border-neon-cyan/20 px-2 py-1 rounded">FPS: {fps}</span>
                                <span className="text-[10px] font-mono font-bold text-neon-cyan bg-black/60 backdrop-blur-sm border border-neon-cyan/20 px-2 py-1 rounded">LAT: {latency}ms</span>
                            </div>
                        </div>

                        {/* ESP32 Camera Stream */}
                        <div className="absolute inset-0 bg-[#060a12] flex items-center justify-center overflow-hidden">
                            <img
                                src="http://10.77.189.134:81/stream"
                                alt="ESP32 Camera"
                                className="w-full h-full object-cover"
                            />

                            {/* Scanning line animation */}
                            <motion.div
                                className="absolute top-0 left-0 right-0 h-0.5 bg-neon-cyan/30 blur-[1px] z-10"
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 7, ease: "linear", repeat: Infinity }}
                            />

                            {/* Subtle Crosshair Overlay */}
                            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 z-20">
                                <div className="w-32 h-32 border border-neon-cyan/40 rounded-full flex items-center justify-center">
                                    <div className="w-1 h-1 bg-neon-cyan rounded-full" />
                                </div>
                                <div className="w-full h-[1px] bg-neon-cyan/10 absolute" />
                                <div className="h-full w-[1px] bg-neon-cyan/10 absolute" />
                            </div>
                        </div>

                        <div className="absolute bottom-4 left-4 z-30 pointer-events-none">
                            <span className="text-[10px] font-mono text-white/70 bg-black/60 backdrop-blur-sm border border-white/10 px-2 py-1 rounded tracking-wider">
                                {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* LEFT COLUMN: ROBOT STATUS */}
                <div className="flex flex-col space-y-4 order-2 lg:order-1 w-full lg:pt-[1.75rem]">
                    <h2 className="text-sm font-semibold font-heading text-white uppercase tracking-[0.2em] flex items-center pl-1">
                        <ShieldCheck className="w-4 h-4 mr-2 text-neon-cyan" />
                        Robot Status
                    </h2>

                    <div className="bg-[#0b1220]/80 backdrop-blur-xl p-6 rounded-2xl border border-neon-cyan/20 shadow-[0_0_20px_rgba(0,240,255,0.05)] h-full flex flex-col justify-start">
                        <div className="space-y-8 relative z-10">
                            {/* Current Mode */}
                            <div>
                                <span className="block text-xs font-mono text-neon-cyan/70 uppercase mb-3 tracking-wider">Current Mode</span>
                                <div className={`inline-flex w-full items-center justify-center px-4 py-4 rounded-xl border-2 font-black text-lg tracking-[0.2em] uppercase transition-colors ${mode === 'Patrolling' ? 'bg-neon-cyan/10 border-neon-cyan text-neon-cyan shadow-[0_0_20px_rgba(0,240,255,0.2)]' :
                                    mode === 'Alert Mode' || mode === 'CRITICAL' ? 'bg-neon-red/10 border-neon-red text-neon-red shadow-[0_0_20px_rgba(255,50,50,0.2)] animate-pulse' :
                                        'bg-dark-base border-dark-border text-gray-300'
                                    }`}>
                                    {mode === 'Patrolling' && <span className="w-3 h-3 rounded-full bg-neon-cyan mr-3 animate-ping" />}
                                    {(mode === 'Alert Mode' || mode === 'CRITICAL') && <span className="w-3 h-3 rounded-full bg-neon-red mr-3 animate-ping" />}
                                    {mode}
                                </div>
                            </div>

                            {/* Battery Level */}
                            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-mono text-gray-400 uppercase flex items-center">
                                        <Battery className="w-4 h-4 mr-2 text-neon-cyan" /> Battery Level
                                    </span>
                                    <span className="text-sm font-bold text-neon-cyan font-mono">{battery}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
                                    <motion.div
                                        className="h-full bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${battery}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </div>
                            </div>

                            {/* Network Status */}
                            <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                <span className="text-xs font-mono text-gray-400 uppercase flex items-center">
                                    <Wifi className="w-4 h-4 mr-2 text-neon-cyan" /> Network Status
                                </span>
                                <div className="flex items-center space-x-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${network === 'Online' ? 'bg-neon-green shadow-[0_0_8px_rgba(0,255,100,0.8)]' : 'bg-neon-red shadow-[0_0_8px_rgba(255,50,50,0.8)]'}`} />
                                    <span className="text-sm font-bold text-gray-200 tracking-wider uppercase">{network}</span>
                                </div>
                            </div>

                            {/* Last Activity */}
                            <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                <span className="text-xs font-mono text-gray-400 uppercase flex items-center mb-2">
                                    <Clock className="w-4 h-4 mr-2 text-neon-cyan" /> Last Activity
                                </span>
                                <p className="text-sm text-gray-300 font-medium pl-6">{lastActivity}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: RECENT ALERTS */}
                <div className="flex flex-col space-y-4 order-3 lg:pt-[1.75rem] w-full">
                    <h2 className="text-sm font-semibold font-heading text-white uppercase tracking-[0.2em] flex items-center pl-1">
                        <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
                        Recent Alerts
                    </h2>

                    <div className="bg-[#0b1220]/80 backdrop-blur-xl p-5 border border-neon-cyan/20 rounded-2xl shadow-[0_0_20px_rgba(0,240,255,0.05)] flex flex-col h-full lg:max-h-[calc(100vh-16rem)]">
                        <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2 flex-grow mb-4">
                            <AnimatePresence>
                                {alerts.length > 0 ? (
                                    alerts.slice(0, 3).map((alert, idx) => {
                                        const status = (alert.status || 'LOGGED').toUpperCase();
                                        const statusStyles = 
                                            status === 'ACTIVE' ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-red-500/5' :
                                            status === 'VERIFIED' ? 'border-neon-cyan/50 bg-neon-cyan/5' :
                                            'border-yellow-500/50 bg-yellow-500/5';
                                        
                                        const dotColor = 
                                            status === 'ACTIVE' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' :
                                            status === 'VERIFIED' ? 'bg-neon-cyan shadow-[0_0_8px_rgba(0,240,255,0.8)]' :
                                            'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]';

                                        return (
                                            <motion.div
                                                key={alert.id || idx}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className={`p-4 rounded-xl border ${statusStyles} backdrop-blur-sm relative overflow-hidden transition-all duration-300`}
                                            >
                                                <div className="flex justify-between items-start mb-2 relative z-10">
                                                    <span className="text-[10px] font-mono opacity-80 flex items-center gap-1.5 font-bold">
                                                        {getSeverityIcon(alert.severity || 'info')}
                                                        {alert.created_at ? new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                                                    </span>
                                                    <span className={`text-[9px] font-bold uppercase tracking-widest bg-black/60 px-2.5 py-1 rounded border border-current opacity-90 ${
                                                        status === 'ACTIVE' ? 'text-red-500' : status === 'VERIFIED' ? 'text-neon-cyan' : 'text-yellow-500'
                                                    }`}>
                                                        {alert.status || 'Active'}
                                                    </span>
                                                </div>
                                                <div className="flex items-start gap-2 relative z-10 mt-1">
                                                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dotColor}`} />
                                                    <p className="text-sm font-medium leading-snug">
                                                        {alert.message}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-40 text-gray-500 opacity-60">
                                        <AlertTriangle className="w-8 h-8 mb-2 opacity-20" />
                                        <p className="text-xs font-mono uppercase tracking-widest">No alerts detected</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="mt-auto pt-4 border-t border-neon-cyan/10 flex-shrink-0">
                            <button
                                onClick={() => navigate('/alerts')}
                                className="w-full py-3 px-4 bg-neon-cyan/5 border border-neon-cyan/30 rounded-xl text-xs font-bold text-neon-cyan uppercase tracking-widest hover:bg-neon-cyan/20 hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-all"
                            >
                                View All Alerts
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default UserDashboard;
