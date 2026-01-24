'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { deleteRestaurantCascading } from '@/lib/admin';
import EditRestaurantModal from '@/components/EditRestaurantModal';
import { Trash2, Store, Loader2, Globe, MapPin, Search, ArrowUpRight, Plus } from 'lucide-react';
import Link from 'next/link';

interface RestaurantData {
    id: string;
    name: string;
    location: string;
    address?: string;
    lat?: number;
    lng?: number;
    website?: string;
    createdAt?: any;
}

export default function RestaurantsAdmin() {
    const [restaurants, setRestaurants] = useState<RestaurantData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRestaurants() {
            try {
                const snap = await getDocs(query(collection(db, 'restaurants'), orderBy('name')));
                setRestaurants(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as RestaurantData)));
            } catch (error) {
                console.error("Error fetching restaurants:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchRestaurants();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This will also permanently delete all associated sandwiches and reviews.`)) return;

        setDeleting(id);
        try {
            await deleteRestaurantCascading(id);
            setRestaurants(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error("Error deleting restaurant:", error);
            alert("Failed to delete restaurant.");
        } finally {
            setDeleting(null);
        }
    };

    const filtered = restaurants.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.location.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic tracking-tighter text-breakfast-coffee mb-2">THE MAP ROOM</h1>
                    <p className="text-muted-foreground text-lg italic max-w-xl">Curate the list of establishments that define the city's breakfast culture.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                    <div className="relative flex-1 sm:w-80 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Locate establishment..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                {loading ? (
                    <div className="col-span-full py-48 flex flex-col items-center justify-center">
                        <div className="relative w-24 h-24 mb-8">
                            <div className="absolute inset-0 border-8 border-primary/10 rounded-full" />
                            <div className="absolute inset-0 border-8 border-primary border-l-transparent rounded-full animate-spin" />
                            <Store className="absolute inset-0 m-auto text-primary animate-pulse" size={32} />
                        </div>
                        <p className="text-muted-foreground font-black italic tracking-[0.4em] uppercase">Consulting the Blueprints...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full py-32 text-center flex flex-col items-center gap-6 glassmorphism rounded-[3rem] border border-dashed border-border/50">
                        <div className="bg-secondary/50 p-6 rounded-full text-muted-foreground/20">
                            <Store size={64} />
                        </div>
                        <p className="text-muted-foreground italic text-xl font-medium">"No such haven exists in our records."</p>
                    </div>
                ) : (
                    filtered.map((rest) => (
                        <div key={rest.id} className="glassmorphism p-8 rounded-[2.5rem] border border-white/10 flex flex-col justify-between group hover:shadow-2xl hover:shadow-primary/5 transition-all relative overflow-hidden">
                            {/* Accent Background */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors" />

                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="text-3xl font-black text-breakfast-coffee tracking-tight leading-[1.1]">{rest.name}</h3>
                                    <div className="flex gap-2">
                                        <EditRestaurantModal
                                            restaurant={rest}
                                            className="p-3.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all shadow-sm active:scale-95"
                                        />
                                        <button
                                            onClick={() => handleDelete(rest.id, rest.name)}
                                            disabled={deleting === rest.id}
                                            className="p-3.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-2xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                            title="Permanently Remove"
                                        >
                                            {deleting === rest.id ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-breakfast-coffee/70 font-bold group-hover:text-primary transition-colors">
                                        <div className="p-2 bg-primary/10 rounded-xl">
                                            <MapPin size={18} />
                                        </div>
                                        {rest.location}
                                    </div>
                                    {rest.website && (
                                        <a
                                            href={rest.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-muted-foreground font-bold hover:text-primary transition-all pl-2"
                                        >
                                            <Globe size={18} />
                                            <span className="text-sm underline underline-offset-4 decoration-border group-hover:decoration-primary">Official Portal</span>
                                            <ArrowUpRight size={14} className="opacity-50" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-border/20 flex justify-between items-center relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Reference ID</span>
                                    <span className="text-xs font-mono font-bold text-muted-foreground/60">{rest.id.slice(0, 16).toUpperCase()}</span>
                                </div>
                                <Link
                                    href={`/search?q=${encodeURIComponent(rest.name)}`}
                                    className="px-6 py-2.5 bg-secondary hover:bg-primary hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-sm"
                                >
                                    Sandwiches
                                    <ArrowUpRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex justify-center border-t border-border/10 pt-10 pb-20 italic">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Plus size={14} className="text-primary" />
                    New establishments are automatically added via the Submission portal.
                </p>
            </div>
        </div>
    );
}
