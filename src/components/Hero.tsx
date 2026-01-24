'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ArrowRight } from 'lucide-react';

export default function Hero() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    return (
        <section className="relative overflow-hidden rounded-3xl bg-breakfast-cream py-10 px-8 mb-12 hero-gradient shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold text-breakfast-coffee leading-tight mb-6 tracking-tighter">
                    Find your next favorite <span className="text-primary italic underline decoration-primary/30">sammy.</span>
                </h1>

                <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto italic font-medium">
                    The official rating guide for our informal breakfast club. We find the eggs, you eat the sandwiches.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 max-w-md mx-auto relative group">
                    <form onSubmit={handleSearch} className="relative flex-1 w-full">
                        <input
                            type="text"
                            placeholder="What are you craving?"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full h-14 pl-12 pr-4 bg-white rounded-2xl border-2 border-breakfast-border focus:border-primary outline-none text-lg transition-all shadow-md group-focus-within:shadow-xl group-focus-within:-translate-y-1"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={24} />
                    </form>
                    <button
                        onClick={handleSearch}
                        className="h-14 px-8 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg active:scale-95 whitespace-nowrap group-hover:-translate-y-1"
                    >
                        Let's Eat
                    </button>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <MapPin size={16} className="text-primary" />
                        Chicago, IL
                    </div>
                    <div className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors group">
                        See all locations
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </section>
    );
}
