'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, User, Coffee, LogOut, ShieldAlert, Plus, LayoutDashboard, MapPin, X } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
    const router = useRouter();
    const { user, signOut, isVerified, isAdmin } = useAuth();
    const [query, setQuery] = useState('');
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
            setIsSearchFocused(false);
        }
    };

    return (
        <nav className="sticky top-0 z-50 w-full glassmorphism px-6 py-3 flex items-center justify-between gap-2 sm:gap-4 overflow-hidden">
            {/* Logo - Hidden on mobile when search is focused */}
            <Link
                href="/"
                className={`items-center gap-2 group shrink-0 ${isSearchFocused ? 'hidden sm:flex' : 'flex'}`}
            >
                <div className="bg-primary p-2 rounded-xl text-primary-foreground group-hover:rotate-12 transition-transform shadow-lg">
                    <Coffee size={24} strokeWidth={2.5} />
                </div>
                <span className="font-bold text-2xl tracking-tight text-foreground hidden sm:block">
                    Brekky<span className="text-primary italic">Sammy</span>
                </span>
            </Link>

            {/* Search - Condensed to icon on mobile, expands on focus */}
            <div className={`transition-all duration-300 flex items-center ${isSearchFocused ? 'flex-1 grow' : 'w-auto sm:flex-1 sm:max-w-md sm:mx-4 md:mx-8'}`}>
                <form onSubmit={handleSearch} className="relative w-full flex items-center">
                    {!isSearchFocused && (
                        <button
                            type="button"
                            onClick={() => setIsSearchFocused(true)}
                            className="sm:hidden p-2.5 hover:bg-secondary rounded-full transition-colors text-muted-foreground"
                        >
                            <Search size={22} />
                        </button>
                    )}

                    <div className={`relative w-full ${isSearchFocused ? 'block' : 'hidden sm:block'}`}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                            className="w-full bg-secondary/50 border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                            autoFocus={isSearchFocused}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />

                        {/* Mobile Close Button */}
                        {isSearchFocused && (
                            <button
                                type="button"
                                onClick={() => setIsSearchFocused(false)}
                                className="sm:hidden absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Navigation Icons - Hidden on mobile when search is focused */}
            <div className={`${isSearchFocused ? 'hidden sm:flex' : 'flex'} items-center gap-2 md:gap-4 shrink-0`}>
                <Link
                    href="/map"
                    className="p-2.5 hover:bg-secondary rounded-full transition-colors group relative shrink-0"
                    title="Survey the Map"
                >
                    <MapPin size={20} />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Map Room</span>
                </Link>

                <Link
                    href="/submit"
                    className="flex items-center gap-2 bg-primary text-white p-2.5 md:px-5 md:py-2.5 rounded-full font-black text-sm hover:scale-[1.05] transition-transform shadow-lg active:scale-95 shrink-0"
                    title="Rate a Sammy"
                >
                    <Plus size={18} />
                    <span className="hidden md:block">Rate a Sammy</span>
                </Link>

                {isAdmin && (
                    <Link
                        href="/admin"
                        className="p-2 hover:bg-secondary rounded-full transition-colors group relative shrink-0"
                        title="Admin Dashboard"
                    >
                        <LayoutDashboard size={18} />
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Admin Dashboard</span>
                    </Link>
                )}

                {user ? (
                    <div className="flex items-center gap-3 shrink-0">
                        <Link href="/profile" className="flex items-center gap-3 hover:bg-secondary rounded-full pl-3 pr-1 py-1 transition-colors shrink-0">
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
                                <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full border border-border object-cover shrink-0" />
                            ) : (
                                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
                                    {(user.displayName || user.email)?.[0].toUpperCase()}
                                </div>
                            )}
                        </Link>
                        <button
                            onClick={() => signOut()}
                            className="p-2 hover:bg-destructive/10 hover:text-destructive rounded-full transition-colors group relative shrink-0"
                            title="Sign Out"
                        >
                            <LogOut size={18} />
                            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Sign Out</span>
                        </button>
                    </div>
                ) : (
                    <Link href="/login" className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded-full transition-colors text-sm font-medium shrink-0">
                        <User size={18} />
                        <span className="hidden md:block">Login</span>
                    </Link>
                )}
            </div>
        </nav>
    );
}
