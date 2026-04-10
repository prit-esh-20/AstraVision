import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Download, Video, X, Calendar, Clock, HardDrive, Filter, FileVideo, Search } from 'lucide-react';

const RecordingCard = ({ recording: rec, onSelect, onDownload }: any) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 15 }}
        transition={{ duration: 0.3 }}
        className="bg-[#0b1220]/80 backdrop-blur-sm border border-dark-border rounded-xl overflow-hidden hover:border-neon-cyan/40 hover:shadow-[0_0_25px_rgba(0,240,255,0.1)] transition-all duration-300 group flex flex-col h-full shadow-lg"
    >
        {/* Thumbnail */}
        <div className="relative aspect-video bg-[#05080f] overflow-hidden flex items-center justify-center cursor-pointer" onClick={() => onSelect(rec)}>
            {rec.thumbnail_url ? (
                <img src={rec.thumbnail_url} className="absolute inset-0 w-full h-full object-cover opacity-60 recording-thumb" alt="Thumbnail" />
            ) : (
                <FileVideo className="w-12 h-12 text-neon-cyan/5 group-hover:scale-125 transition-transform duration-700 absolute" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1220] via-transparent to-transparent z-10 opacity-90" />

            {/* Play Button Overlay */}
            <div className="z-20 w-12 h-12 rounded-full bg-neon-cyan/10 backdrop-blur-md border border-neon-cyan/50 flex items-center justify-center text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)] group-hover:bg-neon-cyan group-hover:text-black group-hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] group-hover:scale-110 group-hover:border-neon-cyan transition-all duration-300">
                <Play className="w-5 h-5 ml-1" fill="currentColor" />
            </div>

            <div className="absolute bottom-2 right-2 z-20 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-widest text-white border border-white/10 shadow-md">
                {rec.duration || "00:00"}
            </div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow relative z-20 bg-gradient-to-b from-[#0b1220]/0 to-[#0b1220]/80">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2 leading-normal group-hover:text-neon-cyan transition-colors line-clamp-2">
                {rec.title}
            </h3>
            <span className="text-[10px] font-bold tracking-widest uppercase text-neon-cyan bg-neon-cyan/5 px-2 py-1 inline-block w-max rounded border border-neon-cyan/20 mb-4">
                {rec.category}
            </span>

            <div className="space-y-2 mb-6 flex-grow bg-black/20 p-3 rounded-lg border border-white/5">
                <div className="flex items-center text-xs font-mono text-gray-400">
                    <Calendar className="w-3.5 h-3.5 mr-2 text-neon-cyan" />
                    {rec.recorded_at ? new Date(rec.recorded_at).toLocaleString() : "Unknown Date"}
                </div>
                <div className="flex items-center text-xs font-mono text-gray-400">
                    <Clock className="w-3.5 h-3.5 mr-2 text-neon-cyan" />
                    {rec.duration || "Unknown Time"}
                </div>
                <div className="flex items-center text-xs font-mono text-gray-400">
                    <HardDrive className="w-3.5 h-3.5 mr-2 text-neon-cyan" />
                    {rec.file_size || "Unknown Size"}
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
                <button
                    onClick={() => onSelect(rec)}
                    className="w-full py-2.5 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center space-x-2"
                >
                    <Play className="w-3.5 h-3.5" fill="currentColor" />
                    <span>Play</span>
                </button>
                <button
                    onClick={(e) => onDownload(e, rec.title || rec.type)}
                    className="w-full py-2.5 bg-transparent border border-neon-green/50 text-neon-green rounded-lg text-[10px] font-black uppercase tracking-widest hover:border-neon-green hover:bg-neon-green/10 hover:shadow-[0_0_15px_rgba(0,255,100,0.2)] transition-all flex items-center justify-center space-x-2 group/btn"
                >
                    <Download className="w-3.5 h-3.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    <span>Save</span>
                </button>
            </div>
        </div>
    </motion.div>
);

const Recordings = () => {
    const [recordings, setRecordings] = useState<any[]>([]);
    const [category, setCategory] = useState("all");
    const [sort, setSort] = useState('Latest First');
    const [search, setSearch] = useState("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedRecording, setSelectedRecording] = useState<any | null>(null);

    const fetchRecordings = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/recordings?category=${category}`);
            const data = await res.json();
            
            // Sort frontend data since API sorting might not be implemented
            data.sort((a: any, b: any) => {
                const timeA = new Date(a.created_at || 0).getTime();
                const timeB = new Date(b.created_at || 0).getTime();
                return sort === 'Latest First' ? timeB - timeA : timeA - timeB;
            });
            
            setRecordings(data);
        } catch (error) {
            console.error("Failed to fetch recordings", error);
        }
    };

    useEffect(() => {
        fetchRecordings();
    }, [category, sort]);

    const filteredRecordings = recordings.filter((rec) =>
        rec.title?.toLowerCase().includes(search.toLowerCase())
    );

    const handleDownload = (e: React.MouseEvent, title: string) => {
        e.stopPropagation();
        // Simulate download
        alert(`Simulating download for: ${title}`);
    };

    return (
        <div className="min-h-screen pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto flex flex-col">
            <div className="mb-10 text-center flex flex-col items-center">
                <h1 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest drop-shadow-[0_0_15px_rgba(0,240,255,0.3)] flex items-center justify-center w-full">
                    <Video className="w-6 h-6 md:w-8 md:h-8 mr-4 text-neon-cyan inline-block shrink-0" />
                    SECURITY RECORDINGS
                </h1>
                <p className="text-sm text-neon-cyan/70 font-mono mt-3 tracking-widest uppercase text-center w-full block">Captured incidents and patrol recordings</p>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-neon-cyan to-transparent mt-6 opacity-40 mx-auto" />
            </div>

            {/* Filter and Sort Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-[#0b1220]/80 border border-neon-cyan/20 p-4 rounded-xl backdrop-blur-md gap-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative z-10">
                <div className="flex items-center space-x-2 sm:space-x-4 w-full md:w-auto overflow-x-auto custom-scrollbar pb-2 md:pb-0 scroll-smooth snap-x">
                    <Filter className="w-4 h-4 text-gray-400 hidden sm:block shrink-0" />
                    {['all', 'motion', 'intrusion', 'patrol', 'tamper'].map(f => (
                        <button
                            key={f}
                            onClick={() => setCategory(f)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap snap-center shrink-0 ${category === f ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'bg-transparent text-gray-400 border border-transparent hover:text-white hover:border-dark-border hover:bg-white/5'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="w-full md:w-auto flex justify-end shrink-0">
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="w-full md:w-auto bg-black/50 border border-neon-cyan/30 text-neon-cyan text-xs font-bold uppercase tracking-widest rounded-lg px-4 py-3 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] appearance-none cursor-pointer pr-10 hover:border-neon-cyan/60 transition-colors"
                        style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2300f0ff%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.7rem top 50%', backgroundSize: '0.65rem auto' }}
                    >
                        <option value="Latest First" className="bg-[#0b1220]">Latest First</option>
                        <option value="Oldest First" className="bg-[#0b1220]">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8 relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-cyan/50" />
                <input
                    type="text"
                    placeholder="Search recordings by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#0b1220]/80 border border-neon-cyan/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 font-mono text-sm focus:outline-none focus:border-neon-cyan/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all backdrop-blur-md"
                />
            </div>

            {/* Grid */}
            {filteredRecordings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 min-h-[400px]">
                    <AnimatePresence mode="popLayout">
                        {filteredRecordings.map((rec) => (
                            <RecordingCard 
                                key={rec.id} 
                                recording={rec} 
                                onSelect={setSelectedRecording} 
                                onDownload={handleDownload} 
                            />
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-grow flex flex-col items-center justify-center py-24 bg-[#0b1220]/30 rounded-2xl border border-dark-border border-dashed backdrop-blur-sm"
                >
                    <div className="w-24 h-24 rounded-full bg-black/50 border border-dark-border flex items-center justify-center mb-6 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
                        <FileVideo className="w-10 h-10 text-gray-700" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest mb-2">No Recordings Found</h3>
                    <p className="text-sm text-gray-500 font-mono text-center max-w-sm">No security captures match the current filtering parameters. Adjust filters to search past archives.</p>
                </motion.div>
            )}

            {/* Video Modal */}
            <AnimatePresence>
                {selectedRecording && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#0b1220] border border-neon-cyan/40 rounded-2xl w-full max-w-5xl overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.15)] relative flex flex-col max-h-[90vh]"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_10px_rgba(0,240,255,0.5)]" />

                            <div className="p-4 sm:p-6 border-b border-white/5 flex justify-end items-start bg-[#060a12]/80 backdrop-blur-md shrink-0 relative z-20">
                                <button
                                    onClick={() => setSelectedRecording(null)}
                                    className="p-2 sm:p-2.5 rounded-full bg-dark-surface border border-dark-border text-gray-400 hover:text-white hover:border-neon-red/50 hover:bg-neon-red/10 hover:shadow-[0_0_15px_rgba(255,50,50,0.2)] transition-all group shrink-0"
                                >
                                    <X className="w-5 h-5 group-hover:scale-110 transition-transform group-hover:text-neon-red" />
                                </button>
                            </div>

                            <div className="p-4 sm:p-6 bg-black flex flex-col items-center overflow-y-auto">
                                {selectedRecording.video_url ? (
                                    <video src={selectedRecording.video_url} controls autoPlay className="w-full rounded-lg" />
                                ) : (
                                    <div className="aspect-video w-full rounded-lg bg-[#05080f] flex flex-col items-center justify-center border border-dark-border border-dashed">
                                        <FileVideo className="w-16 h-16 text-gray-700 mb-4" />
                                        <p className="font-mono text-gray-500 text-sm uppercase tracking-widest">Video Source Unavailable</p>
                                    </div>
                                )}
                                
                                <div className="mt-6 w-full text-left space-y-2">
                                    <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-widest text-neon-cyan">
                                        {selectedRecording.title}
                                    </h2>
                                    <div className="flex flex-wrap items-center gap-4 text-gray-400 font-mono text-sm mt-3 bg-neon-cyan/5 p-4 rounded-lg border border-neon-cyan/10">
                                        <span className="bg-neon-cyan/10 text-neon-cyan px-3 py-1 rounded border border-neon-cyan/20 font-bold uppercase tracking-widest text-xs">
                                            {selectedRecording.category}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <HardDrive className="w-4 h-4 text-neon-cyan" />
                                            {selectedRecording.file_size || "Unknown Size"}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-neon-cyan" />
                                            {selectedRecording.recorded_at ? new Date(selectedRecording.recorded_at).toLocaleString() : "Unknown Date"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Recordings;
