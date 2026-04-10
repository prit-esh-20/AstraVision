import { motion } from 'framer-motion';
import { Cpu, Target, Clock, AlertTriangle, Layers, Maximize } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';

const data = [
    { name: 'Model V1', accuracy: 65, speed: 120 },
    { name: 'Model V2', accuracy: 78, speed: 95 },
    { name: 'Quantized', accuracy: 85, speed: 45 },
    { name: 'Final Tensor', accuracy: 94.5, speed: 28 },
];

const StatCounter = ({ title, value, icon: Icon, unit, neonColorClass }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className={`glass-card p-6 flex items-center space-x-4 border-dark-border hover:border-neon-${neonColorClass}/50 transition-colors`}
    >
        <div className={`p-4 rounded-xl bg-dark-base border border-dark-border text-${neonColorClass}`}>
            <Icon className={`w-8 h-8 `} />
        </div>
        <div>
            <h4 className="text-gray-400 text-sm uppercase tracking-wider">{title}</h4>
            <div className="flex items-baseline space-x-1">
                <span className={`text-3xl font-bold text-white`}>{value}</span>
                <span className={`text-sm text-${neonColorClass} font-bold`}>{unit}</span>
            </div>
        </div>
    </motion.div>
);

const MachineLearning = () => {
    return (
        <div className="pt-8 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-24">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
            >
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-panel border-neon-cyan/50 text-neon-cyan uppercase text-xs font-bold tracking-widest">
                    <Layers className="w-4 h-4" />
                    <span>Vision Core Architecture</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white">MACHINE LEARNING</h1>
                <p className="max-w-2xl mx-auto text-gray-400 text-lg">
                    Our lightweight edge-optimized neural network guarantees rapid threat detection under 30ms.
                </p>
            </motion.div>

            {/* Counters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCounter title="Global Accuracy" value="94.5" unit="%" icon={Target} neonColorClass="cyan" />
                <StatCounter title="Inference Time" value="28" unit="ms" icon={Clock} neonColorClass="blue" />
                <StatCounter title="False Positive Alarms" value="0.02" unit="%" icon={AlertTriangle} neonColorClass="red" />
                <StatCounter title="Detection Range" value="12" unit="m" icon={Maximize} neonColorClass="green" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-6 rounded-2xl border-dark-border"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center space-x-2 text-white">
                            <span className="w-3 h-3 rounded-full bg-neon-cyan animate-pulse" />
                            <span>Model Evolution</span>
                        </h3>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    cursor={{ fill: '#1E293B' }}
                                    contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#00F0FF', color: '#fff', borderRadius: '8px' }}
                                />
                                <Bar dataKey="accuracy" fill="#00A3FF" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-panel p-6 rounded-2xl border-dark-border"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold flex items-center space-x-2 text-white">
                            <span className="w-3 h-3 rounded-full bg-neon-blue animate-pulse" />
                            <span>Inference Latency (ms)</span>
                        </h3>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                                <XAxis dataKey="name" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0B0F17', borderColor: '#00F0FF', color: '#fff', borderRadius: '8px' }}
                                />
                                <Line type="monotone" dataKey="speed" stroke="#00F0FF" strokeWidth={3} dot={{ r: 6, fill: '#00F0FF' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <section className="glass-card p-8 border-dark-border border flex flex-col items-center justify-center space-y-4">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neon-blue to-purple-500">Confusion Matrix & Metrics</h2>
                <p className="text-gray-400 text-center max-w-2xl">
                    Detailed breakdown of model classification performance across 'Human', 'Animal', and 'False Pattern' categories is actively gathered via sensor fusion telemetry. Interactive confusion matrix loading...
                </p>
                <div className="flex items-center space-x-2 text-neon-cyan animate-pulse">
                    <Cpu className="w-6 h-6" />
                    <span>Awaiting Final Test Data Validation</span>
                </div>
            </section>
        </div>
    );
};

export default MachineLearning;
