import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash2, X, AlertTriangle } from 'lucide-react';

interface Identity {
    id: string;
    name: string;
    email: string;
    role: 'Admin' | 'Operator' | 'Viewer';
    password?: string;
    status: 'Active' | 'Inactive';
}

const UserManagement = () => {
    // Empty array to be replaced with backend API fetch
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

    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [addUserState, setAddUserState] = useState<Partial<Identity>>({ name: '', email: '', role: 'Operator', password: '', status: 'Active' });
    const [addUserError, setAddUserError] = useState('');
    const [userSuccessToast, setUserSuccessToast] = useState('');
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const activeUsersCount = users.filter(u => u.status === 'Active').length;
    const adminCount = users.filter(u => u.role === 'Admin').length;
    const totalUsersCount = users.length;

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addUserState.name || !addUserState.email || !addUserState.password || !addUserState.role) {
            setAddUserError('All fields are required.');
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(addUserState.email)) {
            setAddUserError('Invalid email format.');
            return;
        }
        if (addUserState.password.length < 6) {
            setAddUserError('Password must be at least 6 characters.');
            return;
        }
        if (users.some(u => u.email === addUserState.email)) {
            setAddUserError('Email already exists.');
            return;
        }

        try {
            console.log({ name: addUserState.name, email: addUserState.email, password: addUserState.password, role: addUserState.role, status: addUserState.status });
            
            const response = await fetch('http://localhost:5000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: addUserState.name,
                    email: addUserState.email,
                    password: addUserState.password,
                    role: addUserState.role,
                    status: addUserState.status
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create user on backend');
            }

            await loadUsers();

            setShowAddUserModal(false);
            setAddUserState({ name: '', email: '', role: 'Operator', password: '', status: 'Active' });
            setAddUserError('');
            setUserSuccessToast('Identity Successfully Provisioned');
            setTimeout(() => setUserSuccessToast(''), 3000);
        } catch (error) {
            console.error('Error creating user:', error);
            setAddUserError('Error connecting to system authority.');
        }
    };

    const handleDeleteUser = async (id: string) => {
        try {
            await fetch(`http://localhost:5000/api/users/${id}`, {
                method: "DELETE"
            });
            await loadUsers();
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    const toggleUserStatus = (id: string) => {
        setUsers(users.map(u => {
            if (u.id === id) {
                return { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' };
            }
            return u;
        }));
    };

    return (
        <div className="space-y-6 container mx-auto p-4 sm:p-6 lg:p-8">
            <AnimatePresence>
                {userSuccessToast && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 30, x: '-50%' }}
                        exit={{ opacity: 0, y: -50, x: '-50%' }}
                        className="fixed top-0 left-1/2 z-50 px-6 py-3 rounded-full flex items-center space-x-3 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                    >
                        <span className="font-bold tracking-widest uppercase text-sm">{userSuccessToast}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold font-heading text-white uppercase tracking-[0.1em] drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                    USER MANAGEMENT
                </h1>

                <button
                    onClick={() => setShowAddUserModal(true)}
                    className="mt-4 sm:mt-0 flex items-center px-4 py-2 bg-neon-cyan/10 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black font-bold uppercase tracking-widest rounded transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Provision New Identity
                </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-panel p-4 flex items-center justify-between border-l-4 border-neon-cyan/80 hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all group">
                    <div>
                        <p className="text-xs text-neon-cyan/80 uppercase tracking-widest font-bold">Total Users</p>
                        <p className="font-mono text-white text-2xl font-bold group-hover:text-neon-cyan transition-colors">{totalUsersCount}</p>
                    </div>
                </div>
                <div className="glass-panel p-4 flex items-center justify-between border-l-4 border-neon-green/80 hover:border-neon-green hover:shadow-[0_0_15px_rgba(50,255,50,0.1)] transition-all group">
                    <div>
                        <p className="text-xs text-neon-green/80 uppercase tracking-widest font-bold">Active Users</p>
                        <p className="font-mono text-white text-2xl font-bold group-hover:text-neon-green transition-colors">{activeUsersCount}</p>
                    </div>
                </div>
                <div className="glass-panel p-4 flex items-center justify-between border-l-4 border-neon-red/80 hover:border-neon-red hover:shadow-[0_0_15px_rgba(255,50,50,0.1)] transition-all group">
                    <div>
                        <p className="text-xs text-neon-red/80 uppercase tracking-widest font-bold">Administrators</p>
                        <p className="font-mono text-white text-2xl font-bold group-hover:text-neon-red transition-colors">{adminCount}</p>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="glass-card border-dark-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-dark-surface/50 text-xs uppercase font-mono tracking-widest text-gray-300 border-b border-dark-border">
                            <tr>
                                <th className="px-6 py-4">Operator Name</th>
                                <th className="px-6 py-4">Email Address</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            <AnimatePresence>
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-mono text-sm">
                                            No identities found. Provision a new identity to get started.
                                        </td>
                                    </tr>
                                )}
                                {users.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className={`hover:bg-dark-surface/30 transition-colors ${user.status?.toLowerCase() === 'inactive' ? 'opacity-50' : ''}`}
                                    >
                                        <td className="px-6 py-4 font-bold text-white tracking-wide">{user.name}</td>
                                        <td className="px-6 py-4 font-mono text-gray-300">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-[10px] rounded font-bold uppercase tracking-wider border ${user.role === 'Admin' ? 'bg-neon-red/10 text-neon-red border-neon-red/20' : user.role === 'Operator' ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20' : 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`flex items-center text-xs uppercase tracking-widest font-bold ${user.status?.toLowerCase() === 'active' ? 'text-green-500' : 'text-gray-500'}`}>
                                                <span className={`w-2 h-2 rounded-full mr-2 ${user.status?.toLowerCase() === 'active' ? 'bg-neon-green shadow-[0_0_8px_rgba(57,255,20,0.8)]' : 'bg-gray-500'}`}></span>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-3">
                                            <button
                                                onClick={() => toggleUserStatus(user.id)}
                                                className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded border transition-colors ${user.status?.toLowerCase() === 'active' ? 'text-green-500 bg-green-500/10 border-green-500/20 hover:bg-green-500/30' : 'text-gray-400 bg-gray-500/10 border-gray-500/20 hover:bg-gray-500/30'}`}
                                            >
                                                {user.status?.toLowerCase() === 'active' ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="text-gray-500 hover:text-neon-red transition-colors p-2 align-middle"
                                                title="Revoke Access"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add User Modal */}
            <AnimatePresence>
                {showAddUserModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-dark-base border border-neon-cyan/50 shadow-[0_0_30px_rgba(0,240,255,0.15)] rounded-lg w-full max-w-md overflow-hidden relative pointer-events-auto"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-dark-border/50">
                                <h3 className="text-white font-bold uppercase tracking-widest text-lg flex items-center">
                                    <UserPlus className="w-5 h-5 mr-3 text-neon-cyan" />
                                    Create System Identity
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => { setShowAddUserModal(false); setAddUserError(''); }}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
                                {addUserError && (
                                    <div className="bg-red-500/10 border border-neon-red/50 text-neon-red px-3 py-2 text-xs font-mono rounded">
                                        {addUserError}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</label>
                                    <input type="text" placeholder="John Doe" value={addUserState.name} onChange={e => setAddUserState({ ...addUserState, name: e.target.value })} className="w-full bg-dark-surface border border-dark-border px-3 py-2 text-white font-mono text-sm focus:border-neon-cyan outline-none rounded transition-all focus:shadow-[0_0_15px_rgba(0,240,255,0.1)]" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</label>
                                    <input type="email" placeholder="user@astravision.ai" value={addUserState.email} onChange={e => setAddUserState({ ...addUserState, email: e.target.value })} className="w-full bg-dark-surface border border-dark-border px-3 py-2 text-white font-mono text-sm focus:border-neon-cyan outline-none rounded transition-all focus:shadow-[0_0_15px_rgba(0,240,255,0.1)]" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Assign Role</label>
                                    <select value={addUserState.role} onChange={e => setAddUserState({ ...addUserState, role: e.target.value as Identity['role'] })} className="w-full bg-dark-surface border border-dark-border px-3 py-2 text-white font-mono text-sm focus:border-neon-cyan outline-none rounded appearance-none hover:border-gray-500 transition-all cursor-pointer">
                                        <option value="Admin">Admin</option>
                                        <option value="Operator">Operator</option>
                                        <option value="Viewer">Viewer (Read-only)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Temporary Password</label>
                                    <input type="password" placeholder="••••••••" value={addUserState.password} onChange={e => setAddUserState({ ...addUserState, password: e.target.value })} className="w-full bg-dark-surface border border-dark-border px-3 py-2 text-white font-mono text-sm focus:border-neon-cyan outline-none rounded transition-all focus:shadow-[0_0_15px_rgba(0,240,255,0.1)]" />
                                </div>

                                <div className="flex items-center justify-between bg-dark-surface border border-dark-border p-3 rounded mt-2">
                                    <span className="text-gray-400 font-mono text-xs uppercase tracking-widest">Account Status</span>
                                    <button type="button" onClick={() => setAddUserState({ ...addUserState, status: addUserState.status === 'Active' ? 'Inactive' : 'Active' })} className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded transition-colors ${addUserState.status === 'Active' ? 'bg-green-500/20 text-green-500 border border-green-500' : 'bg-gray-500/20 text-gray-500 border border-gray-500'}`}>
                                        {addUserState.status}
                                    </button>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4 border-t border-dark-border/50 mt-6">
                                    <button type="button" onClick={() => { setShowAddUserModal(false); setAddUserError(''); }} className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors">Cancel</button>
                                    <button type="submit" className="px-4 py-2 text-xs font-bold tracking-widest uppercase bg-neon-cyan/20 text-neon-cyan border border-neon-cyan hover:bg-neon-cyan hover:text-black transition-all shadow-[0_0_10px_rgba(0,240,255,0.2)]">Provision Identity</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {userToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-dark-base border border-neon-red/50 shadow-[0_0_30px_rgba(255,50,50,0.15)] p-6 max-w-sm w-full relative before:absolute before:inset-0 before:border before:border-neon-red/20 before:animate-pulse pointer-events-auto rounded-lg"
                        >
                            <h3 className="text-neon-red font-bold uppercase tracking-widest text-lg mb-2 flex items-center">
                                <AlertTriangle className="w-5 h-5 mr-2" />
                                Delete Identity
                            </h3>
                            <p className="text-gray-300 font-mono text-sm mb-6">This action will permanently revoke access for this user. Continue?</p>
                            <div className="flex justify-end space-x-4 relative z-10">
                                <button onClick={() => setUserToDelete(null)} className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors">Cancel</button>
                                <button onClick={() => { if (userToDelete) handleDeleteUser(userToDelete); setUserToDelete(null); }} className="px-4 py-2 text-xs font-bold tracking-widest uppercase bg-neon-red/20 text-neon-red border border-neon-red hover:bg-neon-red hover:text-black transition-all shadow-[0_0_10px_rgba(255,50,50,0.2)]">Confirm</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserManagement;
