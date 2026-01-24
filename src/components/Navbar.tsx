'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, User, Coffee, LogOut, ShieldAlert, Plus, LayoutDashboard, MapPin } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
    const router = useRouter();
    const { user, signOut, isVerified, isAdmin } = useAuth();
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full glassmorphism px-6 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-primary p-2 rounded-xl text-primary-foreground group-hover:rotate-12 transition-transform shadow-lg">
                    <Coffee size={24} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-2xl tracking-tight text-foreground hidden sm:block">
                    Brekky<span className="text-primary italic">Sammy</span>
                </span>
            </Link>

            <div className="flex-1 max-w-md mx-4 md:mx-8">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-secondary/50 border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                </form>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                <Link
                    href="/map"
                    className="p-2.5 hover:bg-secondary rounded-full transition-colors group relative"
                    title="Survey the Map"
                >
                    <MapPin size={20} />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Map Room</span>
                </Link>

                <Link
                    href="/submit"
                    className="flex items-center gap-2 bg-primary text-white p-2.5 md:px-5 md:py-2.5 rounded-full font-black text-sm hover:scale-[1.05] transition-transform shadow-lg active:scale-95"
                    title="Rate a Sammy"
                >
                    <Plus size={18} />
                    <span className="hidden md:block">Rate a Sammy</span>
                </Link>

                {isAdmin && (
                    <Link
                        href="/admin"
                        className="p-2 hover:bg-secondary rounded-full transition-colors group relative"
                        title="Admin Dashboard"
                    >
                        <LayoutDashboard size={18} />
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Admin Dashboard</span>
                    </Link>
                )}

                {user ? (
                    <div className="flex items-center gap-3">
                        <Link href="/profile" className="flex items-center gap-3 hover:bg-secondary rounded-full pl-3 pr-1 py-1 transition-colors">
                            <div className="flex flex-col items-end hidden md:flex">
                                <span className="text-sm font-semibold leading-none">{user.displayName || user.email?.split('@')[0]}</span>
                                {!isVerified && (
                                    <span className="text-[10px] text-destructive font-bold flex items-center gap-0.5 mt-0.5">
                                        <ShieldAlert size={10} />
                                        UNVERIFIED
                                    </span>
                                )}
                            </div>
                            {user.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full border border-border" />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                    {(user.displayName || user.email)?.[0].toUpperCase()}
                                </div>
                            )}
                        </Link>
                        <button
                            onClick={() => signOut()}
                            className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors group relative"
                            title="Sign Out"
                        >
                            <LogOut size={18} />
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Sign Out</span>
                        </button>
                    </div>
                ) : (
                    <Link href="/login" className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded-full transition-colors text-sm font-medium">
                        <User size={18} />
                        <span className="hidden md:block">Login</span>
                    </Link>
                )}
            </div>
        </nav>
    );
}
