import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Filter, Calendar, AlertTriangle, Info, CheckCircle, ShieldAlert } from 'lucide-react';

const UserLogs = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [filter, setFilter] = useState('All');
    const [dateRange, setDateRange] = useState('Last 24 Hours');

    const fetchLogs = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/logs");
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            console.error("Failed to fetch logs", err);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = useMemo(() => {
        let result = [...logs];
        if (filter !== 'All') {
            result = result.filter(log => (log.event || 'Info').toLowerCase() === filter.toLowerCase());
        }

        // Sort latest first
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return result;
    }, [logs, filter, dateRange]);

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'Critical': return 'border-neon-red/40 bg-neon-red/10 text-neon-red shadow-[0_0_10px_rgba(255,50,50,0.2)]';
            case 'Warning': return 'border-yellow-500/40 bg-yellow-500/10 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]';
            case 'Info': return 'border-neon-cyan/40 bg-neon-cyan/10 text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.2)]';
            default: return 'border-gray-500/40 bg-gray-500/10 text-gray-400';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Critical': return <ShieldAlert className="w-4 h-4 mr-1.5 shrink-0" />;
            case 'Warning': return <AlertTriangle className="w-4 h-4 mr-1.5 shrink-0" />;
            case 'Info': return <Info className="w-4 h-4 mr-1.5 shrink-0" />;
            default: return <CheckCircle className="w-4 h-4 mr-1.5 shrink-0" />;
        }
    };

    return (
        <div className="min-h-screen pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1200px] mx-auto flex flex-col">
            <div className="mb-10 text-center flex flex-col items-center">
                <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center justify-center w-full">
                    <Activity className="w-6 h-6 md:w-8 md:h-8 mr-4 text-neon-cyan inline-block shrink-0" />
                    SYSTEM LOGS
                </h1>
                <p className="text-sm text-neon-cyan/70 font-mono mt-3 tracking-widest uppercase text-center w-full block">Recent activity and event history</p>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-neon-cyan to-transparent mt-6 opacity-40 mx-auto" />
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-[#0b1220]/80 border border-neon-cyan/20 p-4 rounded-xl backdrop-blur-md gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative z-10 w-full">
                <div className="flex items-center space-x-2 sm:space-x-4 w-full md:w-auto overflow-x-auto custom-scrollbar pb-2 md:pb-0 scroll-smooth snap-x">
                    <Filter className="w-4 h-4 text-gray-400 hidden sm:block shrink-0" />
                    {['All', 'Critical', 'Warning', 'Info'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap snap-center shrink-0 ${filter === f ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'bg-transparent text-gray-400 border border-transparent hover:text-white hover:border-dark-border hover:bg-white/5'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="w-full md:w-auto flex justify-end shrink-0 relative">
                    <Calendar className="w-4 h-4 text-neon-cyan absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full md:w-auto bg-black/50 border border-neon-cyan/30 text-neon-cyan text-xs font-bold uppercase tracking-widest rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] appearance-none cursor-pointer hover:border-neon-cyan/60 transition-colors"
                        style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2300f0ff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
                    >
                        <option value="Last 24 Hours" className="bg-[#0b1220]">Last 24 Hours</option>
                        <option value="Last 7 Days" className="bg-[#0b1220]">Last 7 Days</option>
                        <option value="Last 30 Days" className="bg-[#0b1220]">Last 30 Days</option>
                    </select>
                </div>
            </div>

            {/* Logs List Container */}
            <div className="bg-[#0b1220]/80 backdrop-blur-xl border border-neon-cyan/20 rounded-2xl shadow-[0_0_30px_rgba(0,240,255,0.05)] flex-grow overflow-hidden flex flex-col relative">
                {/* Accent Line */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-neon-cyan/50 to-transparent shadow-[0_0_15px_rgba(0,240,255,0.5)] z-0" />

                <div className="overflow-y-auto custom-scrollbar flex-grow p-4 sm:p-6 lg:p-8 space-y-4">
                    <AnimatePresence>
                        {filteredLogs.length > 0 ? (
                            filteredLogs.map((log, idx) => {
                                const type = log.event || 'Info';
                                const dateObj = new Date(log.created_at);
                                const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                const dateStr = dateObj.toLocaleDateString();

                                return (
                                    <motion.div
                                        key={log.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: idx * 0.05, duration: 0.3 }}
                                        className="group relative bg-black/40 hover:bg-[#0b1220] border border-white/5 hover:border-neon-cyan/30 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 transition-all shadow-md hover:shadow-[0_0_20px_rgba(0,240,255,0.1)] z-10"
                                    >
                                        {/* Left Side: Timestamp & Badge */}
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 shrink-0 w-full sm:w-auto">
                                            <div className="flex flex-col w-32 shrink-0">
                                                <span className="text-sm font-bold text-gray-200 uppercase tracking-wider">{timeStr}</span>
                                                <span className="text-[10px] text-gray-500 font-mono tracking-widest">{dateStr}</span>
                                            </div>
                                            <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest flex items-center justify-center sm:w-28 shrink-0 ${getTypeStyles(type)}`}>
                                                {getTypeIcon(type)}
                                                {type}
                                            </div>
                                        </div>

                                        {/* Center: Description */}
                                        <div className="flex-grow pl-0 md:pl-4 border-l-0 md:border-l border-white/10 w-full">
                                            <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                                                {log.description}
                                            </p>
                                        </div>

                                        {/* Right Side: Status Outline */}
                                        <div className="shrink-0 pt-2 md:pt-0 self-end md:self-center w-full md:w-auto text-right md:text-left">
                                            <span className="inline-block px-3 py-1 border border-dark-border text-gray-400 group-hover:border-neon-cyan/40 group-hover:text-neon-cyan rounded text-[10px] font-bold uppercase tracking-widest bg-dark-base shadow-sm transition-all whitespace-nowrap">
                                                Recorded
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-24 flex flex-col items-center justify-center text-center opacity-70"
                            >
                                <div className="w-16 h-16 rounded-full bg-black/50 border border-dark-border flex items-center justify-center mb-6">
                                    <Activity className="w-8 h-8 text-gray-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-400 uppercase tracking-widest mb-2">No Match Found</h3>
                                <p className="text-xs text-gray-500 font-mono max-w-sm">No activity logs recorded matching the current filter and date parameters.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default UserLogs;
