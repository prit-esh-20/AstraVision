
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Eye, Cpu, BellRing, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const FeatureCard = ({ icon: Icon, title, desc, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{
            opacity: 1,
            y: 0,
            transition: { delay, duration: 0.6, ease: "easeOut" }
        }}
        viewport={{ once: true }}
        whileHover={{
            y: -5,
            backgroundColor: "rgba(255, 255, 255, 0.03)",
            borderColor: "rgba(0, 240, 255, 0.4)",
            boxShadow: "var(--shadow-btn-hover)",
            transition: { duration: 0.2, delay: 0 }
        }}
        className="glass-card p-8 flex flex-col items-center text-center group border-dark-border cursor-pointer relative overflow-hidden"
    >
        <motion.div
            className="w-16 h-16 rounded-full bg-dark-base/50 border border-dark-border flex items-center justify-center mb-6 transition-colors duration-300 group-hover:border-neon-cyan/50"
        >
            <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
                <Icon className="w-9 h-9 text-neon-cyan" />
            </motion.div>
        </motion.div>
        <h3 className="text-xl font-semibold font-heading mb-3 text-white transition-colors duration-300 group-hover:text-neon-cyan tracking-[0.1em]">{title}</h3>
        <p className="text-slate-300 font-medium text-sm leading-relaxed transition-colors duration-300 group-hover:text-white">{desc}</p>
        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
);

const PipelineNode = ({ label, delay, icon: Icon, isLast, index }: any) => (
    <div className="flex items-center">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{
                opacity: 1,
                y: 0,
                transition: { delay, duration: 0.5, ease: "easeOut" }
            }}
            viewport={{ once: true }}
            className="flex flex-col items-center group"
        >
            <span className="text-[10px] font-mono text-neon-cyan/40 mb-2 tracking-tighter uppercase">{String(index + 1).padStart(2, '0')}</span>
            <motion.div
                whileHover={{ y: -3, borderColor: "rgba(0, 163, 255, 0.5)" }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="glass-card p-5 flex flex-col items-center relative z-10 w-36 border-neon-blue/20 shadow-xl cursor-default"
            >
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                    <Icon className="w-6 h-6 text-neon-blue mb-2 transition-colors duration-300 group-hover:text-neon-cyan" />
                </motion.div>
                <span className="text-[10px] font-bold font-heading uppercase text-center text-slate-400 group-hover:text-white transition-colors duration-300 tracking-[0.12em]">{label}</span>
            </motion.div>
        </motion.div>
        {!isLast && (
            <div className="h-0.5 w-12 md:w-24 bg-dark-border/50 relative overflow-hidden mx-1">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-blue/45 to-transparent animate-flow" />
            </div>
        )}
    </div>
);

const Landing = () => {
    const { isAuthenticated } = useAuth();

    // Logged-on users can browse this with the neural background from MainLayout

    return (
        <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-40">
            {/* Hero Section */}
            <section className="text-center flex flex-col items-center justify-center min-h-[70vh] relative pt-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vmax] h-[120vmax] max-w-none pointer-events-none flex items-center justify-center opacity-20">
                    {/* Concentric rings */}
                    <div className="absolute w-full h-full rounded-full border border-neon-cyan/5" />
                    <div className="absolute w-3/4 h-3/4 rounded-full border border-neon-cyan/5" />
                    <div className="absolute w-1/2 h-1/2 rounded-full border border-neon-cyan/10" />
                    <div className="absolute w-1/4 h-1/4 rounded-full border border-neon-cyan/10 border-dashed" />

                    {/* Crosshairs */}
                    <div className="absolute w-full h-px bg-neon-cyan/5" />
                    <div className="absolute h-full w-px bg-neon-cyan/5" />

                    {/* Radar Sweep */}
                    <motion.div
                        className="absolute w-full h-full rounded-full origin-center"
                        style={{
                            background: 'conic-gradient(from 0deg, rgba(0, 240, 255, 0.05) 0deg, transparent 60deg, transparent 360deg)',
                        }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    >
                        <div className="absolute right-1/2 top-0 bottom-1/2 w-[1px] bg-neon-cyan/30 blur-[1px]" />
                    </motion.div>

                    {/* Ping/Pulse */}
                    <motion.div
                        className="absolute w-4 h-4 rounded-full bg-neon-cyan/10 origin-center"
                        animate={{ scale: [1, 25], opacity: [0.4, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeOut", repeatDelay: 6 }}
                    />

                    {/* Center point and text */}
                    <div className="absolute w-2 h-2 rounded-full bg-neon-cyan shadow-dot" />
                    <div className="absolute mt-12 flex items-center space-x-2 opacity-40">
                        <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-ping" />
                        <span className="text-[9px] font-mono text-neon-cyan tracking-[0.3em] uppercase underline-offset-4">
                            Active Scan Area
                        </span>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative z-10 space-y-8"
                >
                    {isAuthenticated && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center space-x-3 px-5 py-2.5 rounded-full glass-panel border-neon-cyan/30 text-neon-cyan shadow-lg"
                        >
                            <span className="w-2 h-2 rounded-full bg-neon-green animate-breathing" />
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">System Live • Monitoring Perimeter</span>
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <h2 className="text-2xl md:text-3xl font-semibold font-heading tracking-[0.25em] text-slate-300 opacity-80 uppercase">ASTRAVISION</h2>
                        <h1 className="text-6xl md:text-8xl font-bold font-heading tracking-[-0.01em] leading-none">
                            <span className="block bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-slate-500 pb-2">
                                AUTONOMOUS
                            </span>
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-neon-blue to-blue-700 pb-2">
                                SECURITY
                            </span>
                        </h1>
                    </div>

                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-300 font-medium leading-relaxed opacity-90 px-4">
                        Real-time AI-powered threat detection system engineered for
                        autonomous perimeter defense and critical infrastructure protection.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 mt-12">
                        <Link to="/login">
                            <motion.button
                                whileHover="hover"
                                whileTap={{ scale: 0.98 }}
                                initial="rest"
                                animate="rest"
                                className="px-10 py-5 bg-neon-cyan text-dark-base font-black rounded-lg uppercase tracking-widest flex items-center space-x-3 shadow-xl relative overflow-hidden"
                            >
                                <motion.span
                                    variants={{
                                        rest: { x: 0 },
                                        hover: { x: -2 }
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className="text-sm relative z-10"
                                >
                                    Start Operations
                                </motion.span>
                                <motion.div
                                    variants={{
                                        rest: { x: 0 },
                                        hover: { x: 4 }
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <ArrowRight className="w-5 h-5 relative z-10" />
                                </motion.div>
                                <motion.div
                                    variants={{
                                        rest: { opacity: 0, scale: 0.8 },
                                        hover: { opacity: 1, scale: 1 }
                                    }}
                                    className="absolute inset-0 bg-white/20 blur-xl pointer-events-none"
                                />
                                <motion.div
                                    variants={{
                                        rest: { y: -2, boxShadow: "0 0 0px rgba(0,240,255,0)" },
                                        hover: { y: -3, boxShadow: "0 10px 40px -10px rgba(0,240,255,0.6)" }
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className="absolute inset-0 rounded-lg"
                                />
                            </motion.button>
                        </Link>

                        <Link to="/results">
                            <motion.button
                                whileHover="hover"
                                whileTap={{ scale: 0.98 }}
                                initial="rest"
                                animate="rest"
                                className="px-10 py-5 glass-panel border-dark-border text-white font-black rounded-lg uppercase tracking-widest transition-colors duration-300 group"
                            >
                                <motion.span
                                    variants={{
                                        rest: { color: "#ffffff" },
                                        hover: { color: "#00F0FF" }
                                    }}
                                    className="text-sm"
                                >
                                    System Results
                                </motion.span>
                                <motion.div
                                    className="inline-block ml-3"
                                    variants={{
                                        rest: { rotate: 0, scale: 1 },
                                        hover: { rotate: 45, scale: 1.1 }
                                    }}
                                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                >
                                    <Activity className="w-5 h-5 text-neon-blue group-hover:text-neon-cyan transition-colors" />
                                </motion.div>
                                <motion.div
                                    variants={{
                                        rest: { y: 0, borderColor: "rgba(30, 41, 59, 1)" },
                                        hover: { y: -3, borderColor: "rgba(0, 240, 255, 0.5)" }
                                    }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                    className="absolute inset-0 rounded-lg border -z-10"
                                />
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Highlights Section */}
            <section className="space-y-20 pt-10">
                <div className="text-center space-y-4 flex flex-col items-center">
                    <span className="text-[10px] font-mono text-neon-cyan/60 tracking-[0.5em] uppercase">Core Features</span>
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-white tracking-[0.1em] uppercase">System Highlights</h2>
                    <div className="w-16 h-1 px-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard icon={Activity} title="LIVE SURVEILLANCE" desc="Real-time visual monitoring through ESP32-CAM for continuous perimeter security." delay={0.1} />
                    <FeatureCard icon={ShieldCheck} title="MULTI-LAYER VERIFIED" desc="Ultrasonic sensing, live camera input, and AI verification minimize false alerts." delay={0.2} />
                    <FeatureCard icon={Eye} title="Real-Time AI" desc="Instant human detection and behavioral analysis at the perimeter edge." delay={0.3} />
                    <FeatureCard icon={Activity} title="Live Console" desc="Instant data synchronization with command center for full system control." delay={0.4} />
                </div>
            </section>

            {/* Detection Pipeline Section */}
            <section className="space-y-24 pb-32">
                <div className="text-center space-y-4 flex flex-col items-center">
                    <span className="text-[10px] font-mono text-neon-blue/60 tracking-[0.5em] uppercase">System Workflow</span>
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-white tracking-[0.1em] uppercase">Operational Pipeline</h2>
                    <div className="w-16 h-1 bg-gradient-to-r from-transparent via-neon-blue to-transparent rounded-full" />
                    <p className="text-slate-300 max-w-2xl mx-auto pt-2 font-medium">Clear security workflow from live camera feed to AI verification and alert dispatch.</p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0 overflow-visible py-4">
                    {[
                        { label: "CAMERA FEED", icon: Activity },
                        { label: "Range Logic", icon: ShieldCheck },
                        { label: "Visual Snap", icon: Eye },
                        { label: "Neural Verify", icon: Cpu },
                        { label: "Alert Dispatch", icon: BellRing }
                    ].map((node, i) => (
                        <PipelineNode
                            key={node.label}
                            index={i}
                            label={node.label}
                            icon={node.icon}
                            delay={i * 0.15}
                            isLast={i === 4}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Landing;
