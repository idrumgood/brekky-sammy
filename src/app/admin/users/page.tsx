'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Shield, ShieldAlert, User, Search, Loader2 } from 'lucide-react';

interface UserData {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    role?: 'admin' | 'user';
    lastLogin?: any;
}

export default function UsersAdmin() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        async function fetchUsers() {
            try {
                const snap = await getDocs(collection(db, 'users'));
                const usersData = snap.docs.map(doc => ({ ...doc.data() } as UserData));
                // Sort by display name or email
                usersData.sort((a, b) => (a.displayName || a.email).localeCompare(b.displayName || b.email));
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchUsers();
    }, []);

    const toggleAdmin = async (user: UserData) => {
        if (updating) return;
        setUpdating(user.uid);
        try {
            const newRole = user.role === 'admin' ? 'user' : 'admin';
            await updateDoc(doc(db, 'users', user.uid), {
                role: newRole,
                updatedAt: serverTimestamp()
            });
            setUsers(prev => prev.map(u => u.uid === user.uid ? { ...u, role: newRole } : u));
        } catch (error) {
            console.error("Error updating user role:", error);
            alert("Failed to update user role.");
        } finally {
            setUpdating(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.displayName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter text-breakfast-coffee mb-2 text-glow">USER ROLES</h1>
                    <p className="text-muted-foreground text-lg italic">Designate the guardians of grease and bread.</p>
                </div>

                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Scan for name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="glassmorphism rounded-[2.5rem] overflow-hidden border border-white/10 shadow-xl overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary/50 border-b border-border/50">
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">User Identity</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Email Address</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Current Level</th>
                            <th className="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground text-right">Clearance Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-32 text-center">
                                    <div className="relative w-16 h-16 mx-auto mb-4">
                                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                    </div>
                                    <p className="text-muted-foreground font-medium animate-pulse">Syncing User Directory...</p>
                                </td>
                            </tr>
                        ) : filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-8 py-32 text-center text-muted-foreground italic">
                                    &quot;No matches found in the sandwich scrolls.&quot;
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.uid} className="hover:bg-primary/5 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt="" className="w-12 h-12 rounded-2xl border-2 border-white/10 shadow-sm" />
                                            ) : (
                                                <div className="w-12 h-12 rounded-2xl bg-secondary/80 flex items-center justify-center text-primary font-black text-xl border-2 border-white/10">
                                                    {(user.displayName || user.email)[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div className="flex flex-col">
                                                <span className="font-black text-breakfast-coffee tracking-tight">{user.displayName || 'Unnamed Sam-Eater'}</span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">UID: {user.uid.slice(0, 8)}...</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm font-bold text-muted-foreground/80">{user.email}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        {user.role === 'admin' ? (
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground text-[10px] font-black rounded-full shadow-lg shadow-primary/20 ring-4 ring-primary/10">
                                                <Shield size={12} strokeWidth={3} />
                                                ADMINISTRATOR
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary text-muted-foreground text-[10px] font-black rounded-full ring-4 ring-secondary/50">
                                                <User size={12} strokeWidth={3} />
                                                USER
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => toggleAdmin(user)}
                                            disabled={updating === user.uid}
                                            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-xs font-black tracking-widest uppercase transition-all active:scale-95 ${user.role === 'admin'
                                                ? 'bg-destructive/10 text-destructive hover:bg-destructive hover:text-white shadow-inner'
                                                : 'bg-primary/10 text-primary hover:bg-primary hover:text-white shadow-sm'
                                                } disabled:opacity-50 group-hover:translate-x-[-4px]`}
                                        >
                                            {updating === user.uid ? (
                                                <Loader2 className="animate-spin" size={14} />
                                            ) : user.role === 'admin' ? (
                                                <ShieldAlert size={14} />
                                            ) : (
                                                <Shield size={14} />
                                            )}
                                            {user.role === 'admin' ? 'DEMOTE' : 'PROMOTE'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center pt-4">
                <p className="text-xs text-muted-foreground flex items-center gap-2 italic">
                    <Shield size={12} />
                    Only promote users you trust with the grease.
                </p>
            </div>
        </div>
    );
}
