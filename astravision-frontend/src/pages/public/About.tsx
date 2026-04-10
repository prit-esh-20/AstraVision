
import { motion } from 'framer-motion';
import { Shield, Zap, Cpu, Activity, Layout, Network, HardDrive, Users } from 'lucide-react';


const About = () => {

    // Allowed for authenticated users to show the backgroundsite-wide

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: "easeOut" as const }
    };

    return (
        <div className="min-h-screen bg-dark-base relative overflow-hidden pb-20">
            {/* Background elements */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-gradient-to-b from-neon-cyan/5 to-transparent pointer-events-none" />

            <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto space-y-24 relative z-10 font-sans">

                {/* 1️⃣ Project Overview Section */}
                <motion.section {...fadeIn} className="space-y-12">
                    <div className="text-center space-y-4">
                        <span className="inline-block text-neon-cyan text-[10px] font-bold tracking-[0.4em] uppercase py-1 px-4 border border-neon-cyan/30 rounded-full bg-neon-cyan/5 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
                            SYSTEM OVERVIEW
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-[0.05em]">
                            ABOUT THE PROJECT
                        </h1>
                    </div>

                    <motion.div
                        whileHover={{ y: -5, borderColor: "rgba(0, 240, 255, 0.4)", boxShadow: "0 20px 40px -20px rgba(0, 240, 255, 0.2)" }}
                        transition={{ duration: 0.2, delay: 0, ease: "easeOut" }}
                        className="glass-card p-10 md:p-16 border-neon-cyan/20 relative group overflow-hidden max-w-[1440px] mx-auto shadow-2xl cursor-default"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent" />
                        <div className="space-y-8 text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-[0.05em]">
                                Autonomous Perimeter Defense
                            </h2>
                            <div className="text-gray-400 text-lg leading-[1.8] font-medium space-y-6 max-w-none">
                                <p>
                                    AstraVision is an autonomous security patrolling system designed to monitor restricted environments in real time. The robot navigates predefined routes while continuously scanning its surroundings using live camera vision, ultrasonic range detection, and intelligent AI-based analysis.
                                </p>
                                <p>
                                    When suspicious activity or unauthorized movement is detected, the system validates the event using multi-layer sensor and vision logic before triggering alerts. Notifications are transmitted instantly to a centralized dashboard, allowing remote monitoring and rapid response.
                                </p>
                                <p>
                                    The goal of this project is to create a cost-effective and intelligent alternative to traditional surveillance systems, reducing human dependency while maintaining continuous perimeter protection.
                                </p>
                            </div>
                        </div>
                        {/* Hover glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/5 to-neon-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
                    </motion.div>
                </motion.section>

                {/* 2️⃣ Core Capabilities Section */}
                <motion.section {...fadeIn} className="space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-[0.05em]">
                            SYSTEM CAPABILITIES
                        </h2>
                        <div className="w-20 h-1 bg-neon-cyan/40 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Autonomous Navigation",
                                desc: "The robot follows predefined paths while adapting to environmental changes using onboard sensing systems.",
                                icon: Network
                            },
                            {
                                title: "Smart Detection",
                                desc: "Live camera vision and ultrasonic sensing identify movement and potential obstacles in restricted zones.",
                                icon: Activity
                            },
                            {
                                title: "AI-Based Validation",
                                desc: "Multi-layer verification logic minimizes false alarms before alert dispatch.",
                                icon: Shield
                            },
                            {
                                title: "Real-Time Monitoring",
                                desc: "Live alerts and system status are streamed to a secure web dashboard.",
                                icon: Layout
                            }
                        ].map((cap, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -8, borderColor: "rgba(0, 240, 255, 0.4)", boxShadow: "0 10px 30px -10px rgba(0, 240, 255, 0.1)" }}
                                transition={{ duration: 0.2, delay: 0, ease: "easeOut" }}
                                className="glass-card p-8 border-dark-border transition-colors group flex flex-col h-full bg-dark-surface/30 shadow-xl cursor-default"
                            >
                                <div className="w-12 h-12 rounded-xl bg-dark-base border border-dark-border flex items-center justify-center mb-6 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-shadow">
                                    <cap.icon className="w-6 h-6 text-neon-cyan" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-4 tracking-tight group-hover:text-neon-cyan transition-colors">
                                    {cap.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                                    {cap.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* 3️⃣ Technology Stack (Simplified) */}
                <motion.section {...fadeIn} className="space-y-16 pt-10">
                    <div className="text-center space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-[0.05em]">
                            SYSTEM TECHNOLOGY
                        </h2>
                        <div className="w-20 h-1 bg-neon-cyan/40 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1440px] mx-auto">
                        {/* Hardware */}
                        <motion.div
                            whileHover={{ y: -5, borderColor: "rgba(0, 240, 255, 0.4)" }}
                            transition={{ duration: 0.2, delay: 0 }}
                            className="space-y-8 glass-card p-10 border-dark-border/50 bg-dark-surface/20 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <HardDrive className="w-8 h-8 text-neon-blue" />
                                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Hardware</h3>
                            </div>
                            <ul className="space-y-4 text-gray-400 font-medium">
                                <li className="flex items-center space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                                    <span>Arduino Controller</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                                    <span>ESP32-CAM</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                                    <span>AI Vision Module</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                                    <span>Ultrasonic Sensors</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                                    <span>Motor Drivers</span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Software */}
                        <motion.div
                            whileHover={{ y: -5, borderColor: "rgba(0, 240, 255, 0.4)" }}
                            transition={{ duration: 0.2, delay: 0 }}
                            className="space-y-8 glass-card p-10 border-dark-border/50 bg-dark-surface/20 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <Cpu className="w-8 h-8 text-neon-blue" />
                                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Software</h3>
                            </div>
                            <ul className="space-y-4 text-gray-400 font-medium">
                                <li className="flex items-center space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                                    <span>AI Detection Engine</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                                    <span>Real-Time Backend Server</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                                    <span>Web Dashboard Interface</span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Connectivity */}
                        <motion.div
                            whileHover={{ y: -5, borderColor: "rgba(0, 240, 255, 0.4)" }}
                            transition={{ duration: 0.2, delay: 0 }}
                            className="space-y-8 glass-card p-10 border-dark-border/50 bg-dark-surface/20 transition-colors"
                        >
                            <div className="flex items-center space-x-4">
                                <Zap className="w-8 h-8 text-neon-blue" />
                                <h3 className="text-xl font-bold text-white uppercase tracking-wider">Connectivity</h3>
                            </div>
                            <ul className="space-y-4 text-gray-400 font-medium">
                                <li className="flex items-center space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                                    <span>Wi-Fi Communication</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                                    <span>Real-Time WebSockets</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
                                    <span>Cloud Synchronization</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </motion.section>

                {/* 4️⃣ Project Team Section */}
                <motion.section {...fadeIn} className="space-y-16">
                    <div className="text-center space-y-4">
                        <Users className="w-10 h-10 text-neon-cyan mx-auto mb-4 opacity-50" />
                        <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-[0.05em]">
                            PROJECT TEAM
                        </h2>
                        <div className="w-20 h-1 bg-neon-cyan/40 mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:md:grid-cols-3 gap-8 max-w-[1440px] mx-auto">
                        {[
                            { name: "Pritesh Mahajan", role: "System Architecture & Software Development", initials: "PM" },
                            { name: "Jalmesh Mhatre", role: "Hardware Integration & Embedded Systems", initials: "JM" },
                            { name: "Siddhesh Murkute", role: "AI Research, Model Integration & Technical Documentation", initials: "SM" }
                        ].map((member, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -8, borderColor: "rgba(0, 240, 255, 0.4)" }}
                                transition={{ duration: 0.2, delay: 0, ease: "easeOut" }}
                                className="glass-card p-10 flex flex-col items-center text-center space-y-6 border-dark-border group transition-colors cursor-default"
                            >
                                <div className="w-24 h-24 rounded-full bg-dark-base border-2 border-neon-cyan/30 flex items-center justify-center relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all duration-500">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-neon-cyan/20 via-transparent to-neon-blue/20" />
                                    <span className="text-3xl font-black text-white relative z-10 group-hover:scale-110 transition-transform duration-500">{member.initials}</span>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white tracking-[0.05em]">{member.name}</h3>
                                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{member.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* 5️⃣ Final Footer Line */}
                <footer className="pt-6 text-center">
                    <p className="text-gray-600 text-[11px] font-bold uppercase tracking-[0.5em] opacity-60">
                        Second Year Robotics Engineering Project – 2026
                    </p>
                </footer>
            </div>
        </div>
    );
};

export default About;
