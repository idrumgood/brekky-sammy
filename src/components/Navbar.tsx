'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search, User, Coffee } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();
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

            <div className="flex-1 max-w-md mx-8">
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Search sandwiches, restaurants, ingredients..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full bg-secondary/50 border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                </form>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/login" className="flex items-center gap-2 px-4 py-2 hover:bg-secondary rounded-full transition-colors text-sm font-medium">
                    <User size={18} />
                    <span className="hidden md:block">Login</span>
                </Link>
            </div>
        </nav>
    );
}
