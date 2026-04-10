import { motion } from 'framer-motion';
import { ShieldAlert, Clock, Info, CheckCircle, TerminalSquare, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const alertSound = new Audio("/sounds/alert.mp3");

const AlertItem = ({ time, msg, type, status }: any) => {
    const formattedType = (type || 'info').toUpperCase();
    
    const getSeverityStyles = (severity: string) => {
        if (severity === 'CRITICAL') return 'border-red-500 shadow-red-500/30 animate-pulse';
        if (severity === 'WARNING') return 'border-yellow-500 shadow-[inset_4px_0_10px_rgba(234,179,8,0.1)]';
        return 'border-neon-cyan shadow-[inset_4px_0_10px_rgba(0,240,255,0.05)]';
    };

    const getIconStyles = (severity: string) => {
        if (severity === 'CRITICAL') return 'text-neon-red border-neon-red/30 bg-neon-red/10';
        if (severity === 'WARNING') return 'text-yellow-500 border-yellow-500/30 bg-yellow-500/10';
        return 'text-neon-cyan border-dark-border bg-dark-base';
    };

    const getBadgeStyles = (severity: string) => {
        if (severity === 'CRITICAL') return 'bg-neon-red/10 text-neon-red border-neon-red/20';
        if (severity === 'WARNING') return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        return 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20';
    };
    
    const renderIcon = (severity: string) => {
        if (severity === 'CRITICAL') return <ShieldAlert size={18} />;
        if (severity === 'WARNING') return <AlertTriangle size={18} />;
        return <Info size={18} />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`glass-panel p-4 border-l-4 rounded-r-xl bg-dark-surface/50 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 hover:bg-dark-surface/80 ${getSeverityStyles(formattedType)}`}
        >
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg border ${getIconStyles(formattedType)}`}>
                    {renderIcon(formattedType)}
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{time}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-tighter ${getBadgeStyles(formattedType)}`}>
                            {formattedType}
                        </span>
                    </div>
                    <p className="text-sm text-gray-200 font-medium leading-relaxed">{msg}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 self-end md:self-auto uppercase tracking-widest">
                <span className="text-[10px] font-bold text-gray-500">Status:</span>
                <span className={`text-[10px] font-black flex items-center gap-1.5 ${status === 'Logged' || status === 'LOGGED' ? 'text-neon-cyan' : 'text-neon-green'}`}>
                    {status === 'Logged' || status === 'LOGGED' ? <TerminalSquare size={10} /> : <CheckCircle size={10} />}
                    {status}
                </span>
            </div>
        </motion.div>
    );
};

const Alerts = () => {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [alerts, setAlerts] = useState<any[]>([]);
    const previousAlertCount = useRef(0);

    const fetchAlerts = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/alerts");
            const data = await res.json();
            
            if (data.length > previousAlertCount.current && previousAlertCount.current !== 0) {
                alertSound.play().catch(e => console.log("Audio play prevented by browser policy", e));
            }
            previousAlertCount.current = data.length;
            
            setAlerts(data);
        } catch (err) {
            console.error("Failed to fetch alerts", err);
        }
    };

    useEffect(() => {
        fetchAlerts();
        const dataInterval = setInterval(fetchAlerts, 2000);
        return () => clearInterval(dataInterval);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto flex flex-col">
            <header className="space-y-4">
                <div className="flex items-center gap-3 text-neon-cyan">
                    <ShieldAlert className="w-8 h-8 opacity-80" />
                    <h1 className="text-4xl font-black tracking-tight uppercase">System Alerts</h1>
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-gray-400 text-lg max-w-2xl font-medium">
                        Real-time log of security events and hardware status validation from the AstraVision perimeter.
                    </p>
                    <div className="px-4 py-2 bg-dark-surface rounded-lg border border-dark-border flex items-center gap-3">
                        <Clock className="w-4 h-4 text-neon-cyan animate-pulse" />
                        <span className="text-xs font-mono text-white tracking-widest uppercase">{currentTime}</span>
                    </div>
                </div>
            </header>

            <div className="space-y-4 relative">
                {/* Vertical Timeline Guide */}
                <div className="absolute left-6 top-8 bottom-8 w-px bg-dark-border/30 z-0 hidden md:block" />

                {alerts.map((alert, i) => (
                    <AlertItem 
                        key={alert.id || i} 
                        time={alert.created_at ? new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'N/A'}
                        msg={alert.message}
                        type={alert.severity || alert.type || 'info'}
                        status={alert.status || 'LOGGED'}
                    />
                ))}
            </div>

            <footer className="pt-10 flex justify-center">
                <div className="px-6 py-3 border border-dark-border rounded-full text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-green animate-breathing" />
                    Monitoring Perimeter Live...
                </div>
            </footer>
        </div>
    );
};

export default Alerts;
