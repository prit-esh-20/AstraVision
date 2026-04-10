import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sliders, Bell, Shield, ShieldCheck, Activity, Thermometer,
    Wifi, Save, RotateCcw, Info, Database, Clock,
    Volume2, Mail, CheckCircle, AlertTriangle
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

const Settings = () => {
    const { systemMode } = useSystem();
    const [hasChanges, setHasChanges] = useState(false);
    const [saveToast, setSaveToast] = useState(false);

    // Detection Settings
    const [detectionConfig, setDetectionConfig] = useState({
        threshold: 85,
        sensitivity: 'Medium',
        thermalDelta: 2.5,
        ultraDistance: 1.5
    });

    // Notification Settings
    const [notificationConfig, setNotificationConfig] = useState({
        systemNotifs: true,
        criticalOnly: false,
        emailAlerts: true,
        soundAlarm: true
    });

    // Safety & Behavior
    const [safetyConfig, setSafetyConfig] = useState({
        autoResume: false,
        logEvents: true,
        cooldown: 30
    });

    const [lastModified, setLastModified] = useState(new Date().toLocaleTimeString());

    const handleSave = () => {
        setHasChanges(false);
        setSaveToast(true);
        setLastModified(new Date().toLocaleTimeString());
        console.log("Settings Updated Successfully by Admin", {
            detection: detectionConfig,
            notifications: notificationConfig,
            safety: safetyConfig
        });
        setTimeout(() => setSaveToast(false), 3000);
    };

    const handleReset = () => {
        setDetectionConfig({ threshold: 85, sensitivity: 'Medium', thermalDelta: 2.5, ultraDistance: 1.5 });
        setNotificationConfig({ systemNotifs: true, criticalOnly: false, emailAlerts: true, soundAlarm: true });
        setSafetyConfig({ autoResume: false, logEvents: true, cooldown: 30 });
        setHasChanges(true);
    };

    return (
        <div className="space-y-6 container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-widest relative inline-block">
                        SYSTEM SETTINGS
                        <motion.div
                            className="absolute -bottom-2 left-0 h-0.5 bg-neon-cyan"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1 }}
                        />
                    </h1>
                    <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.3em] mt-4">
                        Forensic Defense Configuration & Subsystem Tuning
                    </p>
                </div>

                <div className={`flex items-center space-x-3 px-4 py-2 rounded-full border border-dark-border bg-dark-surface/50 transition-all duration-500`}>
                    <span className={`w-2 h-2 rounded-full ${systemMode === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-neon-red shadow-[0_0_8px_rgba(255,50,50,0.6)]'}`} />
                    <span className={`text-[10px] font-bold tracking-widest uppercase ${systemMode === 'ACTIVE' ? 'text-green-500' : 'text-neon-red'}`}>
                        System Status: {systemMode === 'ACTIVE' ? 'Online' : 'Deactivated'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Settings Area */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Detection Configuration */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6 border-dark-border"
                    >
                        <div className="flex items-center space-x-3 mb-8 border-b border-dark-border/50 pb-4">
                            <Sliders className="w-5 h-5 text-neon-cyan" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Detection Configuration</h2>
                        </div>

                        <div className="space-y-10">
                            {/* Threshold Slider */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-300 uppercase tracking-wider flex items-center">
                                        Detection Confidence Threshold
                                        <Info className="w-3 h-3 ml-2 text-gray-600 cursor-help" />
                                    </label>
                                    <span className={`font-mono text-lg font-bold ${detectionConfig.threshold > 90 ? 'text-neon-red' : 'text-neon-cyan'}`}>
                                        {detectionConfig.threshold}%
                                    </span>
                                </div>
                                <input
                                    type="range" min="0" max="100"
                                    value={detectionConfig.threshold}
                                    onChange={(e) => { setDetectionConfig({ ...detectionConfig, threshold: parseInt(e.target.value) }); setHasChanges(true); }}
                                    className="w-full h-1.5 bg-dark-surface rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                                />
                                <div className="flex justify-between text-[10px] font-mono text-gray-600 uppercase">
                                    <span>Lower Accuracy</span>
                                    <span>Target Confidence</span>
                                    <span>Strict Lockdown</span>
                                </div>
                            </div>

                            {/* Sensitivity Toggle Group */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-gray-300 uppercase tracking-wider">Alert Sensitivity</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['Low', 'Medium', 'High'].map((level) => (
                                        <button
                                            key={level}
                                            onClick={() => { setDetectionConfig({ ...detectionConfig, sensitivity: level }); setHasChanges(true); }}
                                            className={`py-3 px-4 rounded border font-bold text-xs uppercase tracking-widest transition-all ${detectionConfig.sensitivity === level ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'bg-transparent border-dark-border text-gray-500 hover:border-gray-600'}`}
                                        >
                                            {level}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Thermal Slider */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                            <Thermometer className="w-3 h-3 mr-2" />
                                            Thermal Delta Threshold
                                        </label>
                                        <span className="font-mono text-neon-cyan text-sm">{detectionConfig.thermalDelta}°C</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100" step="0.5"
                                        value={detectionConfig.thermalDelta}
                                        onChange={(e) => { setDetectionConfig({ ...detectionConfig, thermalDelta: parseFloat(e.target.value) }); setHasChanges(true); }}
                                        className="w-full h-1.5 bg-dark-surface rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                                    />
                                </div>

                                {/* Ultrasonic Slider */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center">
                                            <Wifi className="w-3 h-3 mr-2" />
                                            Ultrasonic Distance
                                        </label>
                                        <span className="font-mono text-neon-cyan text-sm">{detectionConfig.ultraDistance}m</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="10" step="0.1"
                                        value={detectionConfig.ultraDistance}
                                        onChange={(e) => { setDetectionConfig({ ...detectionConfig, ultraDistance: parseFloat(e.target.value) }); setHasChanges(true); }}
                                        className="w-full h-1.5 bg-dark-surface rounded-lg appearance-none cursor-pointer accent-neon-cyan"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Notification Settings */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6 border-dark-border"
                    >
                        <div className="flex items-center space-x-3 mb-8 border-b border-dark-border/50 pb-4">
                            <Bell className="w-5 h-5 text-neon-cyan" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Notification Settings</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { id: 'systemNotifs', label: 'System Notifications', icon: Shield, desc: 'Receive non-critical system updates.' },
                                { id: 'criticalOnly', label: 'Critical Alerts Only', icon: AlertTriangle, desc: 'Mute all indicators except intrusion events.' },
                                { id: 'emailAlerts', label: 'Email Mirroring', icon: Mail, desc: 'Forward security events to admin email.' },
                                { id: 'soundAlarm', label: 'Audio Feedback', icon: Volume2, desc: 'Enable local siren on threat detection.' }
                            ].map((item) => (
                                <div key={item.id} className="flex items-start justify-between p-4 rounded bg-dark-surface/30 border border-dark-border/50 group hover:border-neon-cyan/30 transition-all">
                                    <div className="flex items-start space-x-3">
                                        <div className="mt-1 p-2 rounded bg-dark-base border border-dark-border group-hover:border-neon-cyan/20">
                                            <item.icon className="w-4 h-4 text-gray-400 group-hover:text-neon-cyan transition-colors" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-200 uppercase tracking-widest">{item.label}</p>
                                            <p className="text-[10px] text-gray-500 mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { setNotificationConfig({ ...notificationConfig, [item.id]: !notificationConfig[item.id as keyof typeof notificationConfig] }); setHasChanges(true); }}
                                        className={`w-10 h-5 rounded-full relative transition-all duration-300 ${notificationConfig[item.id as keyof typeof notificationConfig] ? 'bg-neon-cyan' : 'bg-gray-800'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${notificationConfig[item.id as keyof typeof notificationConfig] ? 'right-1' : 'rotate-180 left-1'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Safety & Behavior Controls */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-6 border-dark-border"
                    >
                        <div className="flex items-center space-x-3 mb-8 border-b border-dark-border/50 pb-4">
                            <ShieldCheck className="w-5 h-5 text-neon-cyan" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Safety & Behavior Controls</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded bg-dark-surface/30 border border-dark-border group">
                                <div className="flex items-center space-x-4">
                                    <RotateCcw className="w-5 h-5 text-neon-cyan" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-200 uppercase tracking-widest">Auto Resume After Deactivation</p>
                                        <p className="text-[10px] text-gray-500">Enable autonomous patrol immediately after system activation.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setSafetyConfig({ ...safetyConfig, autoResume: !safetyConfig.autoResume }); setHasChanges(true); }}
                                    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${safetyConfig.autoResume ? 'bg-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.3)]' : 'bg-gray-800'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${safetyConfig.autoResume ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-center justify-between p-4 rounded bg-dark-surface/30 border border-dark-border group">
                                    <div className="flex items-center space-x-4">
                                        <Database className="w-5 h-5 text-gray-400 group-hover:text-neon-cyan" />
                                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Verbose Event Logging</span>
                                    </div>
                                    <button
                                        onClick={() => { setSafetyConfig({ ...safetyConfig, logEvents: !safetyConfig.logEvents }); setHasChanges(true); }}
                                        className={`w-10 h-5 rounded-full relative transition-all duration-300 ${safetyConfig.logEvents ? 'bg-neon-cyan' : 'bg-gray-800'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300 ${safetyConfig.logEvents ? 'right-1' : 'left-1'}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded bg-dark-surface/30 border border-dark-border group">
                                    <div className="flex items-center space-x-4">
                                        <Clock className="w-5 h-5 text-gray-400 group-hover:text-neon-cyan" />
                                        <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">Alert Cooldown (sec)</span>
                                    </div>
                                    <input
                                        type="number"
                                        value={safetyConfig.cooldown}
                                        onChange={(e) => { setSafetyConfig({ ...safetyConfig, cooldown: parseInt(e.target.value) }); setHasChanges(true); }}
                                        className="bg-dark-base border border-dark-border text-neon-cyan font-mono text-sm w-16 p-1 rounded text-center focus:border-neon-cyan outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleReset}
                                className="w-full py-4 border border-dark-border text-gray-500 font-bold uppercase tracking-widest text-xs hover:border-neon-red/50 hover:text-neon-red transition-all flex items-center justify-center space-x-2 rounded"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span>Reset Terminal to Default Configuration</span>
                            </button>
                        </div>
                    </motion.section>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges}
                            className={`flex items-center space-x-3 px-12 py-5 rounded font-extrabold uppercase tracking-[0.3em] transition-all border ${hasChanges ? 'bg-neon-cyan text-black border-neon-cyan shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:scale-105 active:scale-95' : 'bg-dark-surface border-dark-border text-gray-600 cursor-not-allowed opacity-50'}`}
                        >
                            <Save className="w-5 h-5" />
                            <span>Save Settings</span>
                        </button>
                    </div>
                </div>

                {/* Right Summary Side Panel */}
                <div className="space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6 border-neon-cyan/20 sticky top-24"
                    >
                        <div className="flex items-center space-x-3 mb-6">
                            <Activity className="w-4 h-4 text-neon-cyan" />
                            <h3 className="text-white font-bold uppercase tracking-widest text-sm">System Config Summary</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-mono uppercase text-gray-500">
                                    <span>Active Threshold</span>
                                    <span className="text-neon-cyan">{detectionConfig.threshold}%</span>
                                </div>
                                <div className="w-full h-1 bg-dark-base rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-neon-cyan"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${detectionConfig.threshold}%` }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-dark-border/50">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono uppercase text-gray-500">Sensitivity</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border border-neon-cyan/20 text-neon-cyan`}>{detectionConfig.sensitivity}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono uppercase text-gray-500">Notifications</span>
                                    <span className={`text-[10px] font-bold ${notificationConfig.systemNotifs ? 'text-green-500' : 'text-neon-red'}`}>
                                        {notificationConfig.systemNotifs ? 'ENABLED' : 'DISABLED'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-dark-border/50">
                                    <span className="text-[10px] font-mono uppercase text-gray-500 italic">Last Modified</span>
                                    <span className="text-[10px] font-mono text-gray-300">{lastModified}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono uppercase text-gray-500 italic">Modified By</span>
                                    <span className="text-[10px] font-mono text-neon-cyan">Admin_Root</span>
                                </div>
                            </div>

                            <div className="bg-neon-cyan/5 border border-neon-cyan/10 p-4 mt-6 rounded">
                                <div className="flex items-center space-x-2 text-neon-cyan mb-2">
                                    <ShieldCheck className="w-3 h-3" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Protocol Integrity</span>
                                </div>
                                <p className="text-[9px] text-gray-500 leading-tight">
                                    All configurations are checksum-validated before application to the core neural engine.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {saveToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] flex items-center space-x-3 px-6 py-4 bg-dark-base border border-neon-cyan text-neon-cyan rounded-lg shadow-[0_10px_40px_rgba(0,240,255,0.2)]"
                    >
                        <CheckCircle className="w-5 h-5 animate-pulse" />
                        <span className="font-bold uppercase tracking-widest text-sm">Settings Updated Successfully</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer Status */}
            <div className="fixed bottom-4 left-4 z-40">
                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border border-dark-border bg-dark-base/80 backdrop-blur-sm transition-all duration-500`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${systemMode === 'ACTIVE' ? 'bg-green-500 opacity-60' : 'bg-neon-red opacity-60'}`} />
                    <span className={`text-[8px] font-bold tracking-widest uppercase text-gray-400`}>
                        {systemMode === 'ACTIVE' ? 'System Online' : 'System Offline'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Settings;
