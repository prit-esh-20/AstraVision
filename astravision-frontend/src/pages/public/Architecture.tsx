import { motion } from 'framer-motion';
import {
    Cpu, Server, Layout, Camera,
    Activity, Zap, Layers,
    ShieldCheck, ArrowDown, Waves, ArrowRight
} from 'lucide-react';



// --- Components ---

const ArchCard = ({ icon: Icon, title, desc, delay, accent = 'cyan' }: any) => {
    const accentColor = accent === 'cyan' ? 'text-neon-cyan' : 'text-neon-blue';
    const borderColor = accent === 'cyan' ? 'hover:border-neon-cyan/50' : 'hover:border-neon-blue/50';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className={`glass-card p-8 border-dark-border ${borderColor} transition-all duration-300 flex flex-col items-center text-center h-full group relative overflow-hidden`}
        >
            <div className={`p-4 rounded-2xl bg-dark-base border border-dark-border mb-6 group-hover:border-current transition-colors ${accentColor}`}>
                <Icon className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
            </div>

            <h3 className="text-xl font-bold text-white mb-3 tracking-[0.05em]">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
                {desc}
            </p>
        </motion.div>
    );
};

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div className="flex flex-col items-center mb-4 text-center relative z-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-[0.05em] mb-4">
            {title}
        </h2>
        <p className="max-w-2xl text-gray-400 text-base leading-relaxed">
            {subtitle}
        </p>
    </div>
);

const FlowIndicator = () => (
    <div className="flex justify-center py-2 relative">
        <div className="flex flex-col items-center gap-1">
            <div className="w-[1px] h-12 bg-gradient-to-b from-dark-border via-neon-cyan/40 to-dark-border relative">
                <motion.div
                    className="absolute top-0 left-0 -translate-x-1/2 w-[2px] h-10 bg-gradient-to-b from-transparent via-neon-cyan to-transparent"
                    animate={{ top: ["0%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
            </div>
            <ArrowDown className="w-5 h-5 text-neon-cyan/50" />
        </div>
    </div>
);

// --- Main Component ---

const Architecture = () => {

    // Session persistence enabled for background rendering

    return (
        <div className="min-h-screen pt-8 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">

            {/* Background Soft Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-neon-cyan/20 rounded-full blur-[160px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-neon-blue/20 rounded-full blur-[160px]" />
            </div>

            {/* Hero Section */}
            <header className="relative z-10 text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                >
                    <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-dark-surface/50 border border-neon-cyan/20 text-neon-cyan uppercase text-[10px] font-black tracking-[0.3em] mx-auto">
                        <Layers className="w-4 h-4" />
                        <span>System Structure</span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-bold text-white tracking-[-0.01em] uppercase leading-none">
                        ENGINEERING <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-blue">BLUEPRINT</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed px-4">
                        A project-focused overview of the AstraVision patrolling robot,
                        explaining the workflow from hardware sensors to the operator dashboard.
                    </p>
                </motion.div>

                {/* Simplified Overview Strip */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-10 bg-dark-surface/60 backdrop-blur-md border border-dark-border/50 py-4 px-10 rounded-2xl flex flex-wrap justify-center items-center gap-12 shadow-glass max-w-4xl mx-auto"
                >
                    {[
                        { label: "Data Flow", value: "Sensing → Processing → Dashboard", icon: Layers },
                        { label: "System Response", value: "Real-time Monitoring", icon: Zap },
                        { label: "Alert Logic", value: "Multi-sensor Fusion", icon: ShieldCheck },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-dark-base border border-dark-border">
                                <item.icon className="w-4 h-4 text-neon-cyan" />
                            </div>
                            <div className="text-left">
                                <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest">{item.label}</p>
                                <p className="text-xs font-bold text-gray-200">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </header>

            {/* Layered Content */}
            <div className="relative z-10">

                {/* 1. OPERATIONAL OVERVIEW */}
                <section className="mb-0">
                    <SectionHeader
                        title="Operational Overview"
                        subtitle="The top layer where administrators monitor robot status, view live camera streams, and receive instant alerts."
                    />
                    <div className="max-w-2xl mx-auto">
                        <ArchCard
                            icon={Layout}
                            title="Command Dashboard"
                            desc="A centralized web interface showing the robot's health, current location, and real-time detection logs for immediate response."
                            accent="blue"
                            delay={0.1}
                        />
                    </div>
                </section>

                <FlowIndicator />

                {/* 2. CLOUD PROCESSING MODULE */}
                <section className="mb-0">
                    <SectionHeader
                        title="Cloud Processing Module"
                        subtitle="The intelligence hub where visual frames and sensor data is analyzed using machine learning models to identify potential security threats."
                    />
                    <div className="max-w-2xl mx-auto">
                        <ArchCard
                            icon={Server}
                            title="Intelligence Pipeline"
                            desc="FastAPI backend that receives visual frames and sensor readings, evaluates them against pre-set thresholds, and determines if an alert is necessary."
                            accent="blue"
                            delay={0.1}
                        />
                    </div>
                </section>

                <FlowIndicator />

                {/* 3. EDGE HARDWARE LAYER */}
                <section className="mb-12">
                    <SectionHeader
                        title="Edge Hardware Layer"
                        subtitle="The physical robot hardware responsible for navigating the environment and collecting live security data."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ArchCard
                            icon={Camera}
                            title="ESP32-CAM"
                            desc="Captures live video frames and transmits them to the server for processing."
                            delay={0.1}
                        />
                        <ArchCard
                            icon={Cpu}
                            title="Arduino Controller"
                            desc="Manages motor movements and handles low-level sensor timing and coordination."
                            delay={0.2}
                        />
                        <ArchCard
                            icon={Activity}
                            title="AI VISION MODULE"
                            desc="Processes visual frames from ESP32-CAM for intelligent object and threat detection."
                            delay={0.3}
                        />
                        <ArchCard
                            icon={Waves}
                            title="Ultrasonic Sensor"
                            desc="Provides non-visual distance mapping to help the robot avoid obstacles in its path."
                            delay={0.4}
                        />
                    </div>
                </section>

                {/* SENSOR FUSION LOGIC */}
                <section className="relative pt-8">
                    <div className="absolute inset-0 bg-neon-cyan/5 rounded-[3rem] blur-3xl pointer-events-none" />
                    <div className="glass-panel p-12 md:p-16 rounded-[2.5rem] border-dark-border/80 relative">
                        <SectionHeader
                            title="Sensor Fusion Logic"
                            subtitle="To ensure high reliability, the system combines live camera frames, ultrasonic readings, and AI inference before triggering an alert."
                        />

                        <div className="flex flex-wrap items-start justify-center lg:justify-between relative z-10 max-w-6xl mx-auto mt-8 text-center gap-y-12">
                            {[
                                { title: "CAMERA INPUT", desc: "Captures live frames" },
                                { title: "Obstacle Check", desc: "Measures distance" },
                                { title: "Visual Logic", desc: "Analyzes image frames" },
                                { title: "Data Check", desc: "Validates consistent signals" },
                                { title: "Alert Signal", desc: "Notifies dashboard" }
                            ].map((stage, idx, arr) => (
                                <div key={idx} className="flex items-center">
                                    <div className="flex flex-col items-center w-36">
                                        <div className="w-16 h-16 rounded-full bg-dark-base border border-dark-border flex items-center justify-center mb-4 group hover:border-neon-cyan transition-all duration-500 relative">
                                            <div className="absolute inset-0 rounded-full border border-neon-cyan/5 group-hover:border-neon-cyan/20 animate-pulse" />
                                            <span className="text-neon-cyan font-mono font-bold relative z-10">0{idx + 1}</span>
                                        </div>
                                        <h4 className="text-white font-bold text-sm mb-2">{stage.title}</h4>
                                        <p className="text-gray-500 text-[11px] leading-tight">{stage.desc}</p>
                                    </div>

                                    {idx < arr.length - 1 && (
                                        <div className="hidden lg:flex items-center mx-2 h-16 pt-[-16px]">
                                            <motion.div
                                                animate={{
                                                    x: [0, 8, 0],
                                                    opacity: [0.2, 1, 0.2],
                                                    filter: ["drop-shadow(0 0 0px #00F0FF)", "drop-shadow(0 0 8px #00F0FF)", "drop-shadow(0 0 0px #00F0FF)"]
                                                }}
                                                transition={{
                                                    duration: 3,
                                                    repeat: Infinity,
                                                    delay: idx * 0.5,
                                                    ease: "easeInOut"
                                                }}
                                                className="text-neon-cyan/50"
                                            >
                                                <ArrowRight size={28} strokeWidth={2.5} />
                                            </motion.div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <p className="mt-16 text-[11px] font-mono text-gray-500 uppercase tracking-widest text-center border-t border-dark-border pt-8">
                            “Multi-sensor validation logic ensures high accuracy for a real-world security environment.”
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default Architecture;
