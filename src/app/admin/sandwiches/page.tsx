'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { deleteSandwichCascading } from '@/lib/admin';
import { Trash2, Utensils, Loader2, Search, ArrowUpRight, Star } from 'lucide-react';
import Link from 'next/link';
import EditSandwichModal from '@/components/EditSandwichModal';

interface SandwichData {
    id: string;
    name: string;
    restaurantId: string;
    restaurantName?: string;
    averageRating: number;
    reviewCount: number;
    ingredients?: string[];
    createdAt?: any;
}

export default function SandwichesAdmin() {
    const [sandwiches, setSandwiches] = useState<SandwichData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deleting, setDeleting] = useState<string | null>(null);

    async function fetchSandwiches() {
        try {
            // Fetch sandwiches and restaurants to get the names
            const [sandSnap, restSnap] = await Promise.all([
                getDocs(query(collection(db, 'sandwiches'), orderBy('name'))),
                getDocs(collection(db, 'restaurants'))
            ]);

            const restaurantsMap = Object.fromEntries(
                restSnap.docs.map(doc => [doc.id, doc.data().name])
            );

            setSandwiches(sandSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                restaurantName: restaurantsMap[doc.data().restaurantId] || 'Unknown'
            } as SandwichData)));
        } catch (error) {
            console.error("Error fetching sandwiches:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSandwiches();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This will also permanently delete all associated reviews.`)) return;

        setDeleting(id);
        try {
            await deleteSandwichCascading(id);
            setSandwiches(prev => prev.filter(s => s.id !== id));
        } catch (error) {
            console.error("Error deleting sandwich:", error);
            alert("Failed to delete sandwich.");
        } finally {
            setDeleting(null);
        }
    };

    const filtered = sandwiches.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.restaurantName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-10">
            <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic tracking-tighter text-breakfast-coffee mb-2">SANDWICH ARCHIVE</h1>
                    <p className="text-muted-foreground text-lg italic max-w-xl">Manage the library of curated breakfast creations.</p>
                </div>

                <div className="relative flex-1 sm:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search creations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
                {loading ? (
                    <div className="col-span-full py-48 flex flex-col items-center justify-center">
                        <div className="relative w-24 h-24 mb-8">
                            <div className="absolute inset-0 border-8 border-primary/10 rounded-full" />
                            <div className="absolute inset-0 border-8 border-primary border-l-transparent rounded-full animate-spin" />
                            <Utensils className="absolute inset-0 m-auto text-primary animate-pulse" size={32} />
                        </div>
                        <p className="text-muted-foreground font-black italic tracking-[0.4em] uppercase">Inventorying the Bread...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="col-span-full py-32 text-center flex flex-col items-center gap-6 glassmorphism rounded-[3rem] border border-dashed border-border/50">
                        <div className="bg-secondary/50 p-6 rounded-full text-muted-foreground/20">
                            <Utensils size={64} />
                        </div>
                        <p className="text-muted-foreground italic text-xl font-medium">&quot;No such creation exists in our records.&quot;</p>
                    </div>
                ) : (
                    filtered.map((sandwich) => (
                        <div key={sandwich.id} className="glassmorphism p-8 rounded-[2.5rem] border border-white/10 flex flex-col justify-between group hover:shadow-2xl hover:shadow-primary/5 transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem] -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors" />

                            <div className="space-y-6 relative z-10">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="text-3xl font-black text-breakfast-coffee tracking-tight leading-[1.1]">{sandwich.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <EditSandwichModal
                                            sandwich={{
                                                id: sandwich.id,
                                                name: sandwich.name,
                                                restaurantId: sandwich.restaurantId,
                                                ingredients: sandwich.ingredients
                                            }}
                                            className="p-3.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-2xl transition-all shadow-sm active:scale-95"
                                            onSuccess={fetchSandwiches}
                                        />
                                        <button
                                            onClick={() => handleDelete(sandwich.id, sandwich.name)}
                                            disabled={deleting === sandwich.id}
                                            className="p-3.5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-2xl transition-all shadow-sm active:scale-95 disabled:opacity-50"
                                            title="Permanently Remove"
                                        >
                                            {deleting === sandwich.id ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                                        BY: {sandwich.restaurantName}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 bg-breakfast-egg/20 text-breakfast-coffee px-3 py-1 rounded-full text-xs font-bold border border-breakfast-egg/30">
                                            <Star size={12} className="fill-current" />
                                            {sandwich.averageRating?.toFixed(1)}
                                        </div>
                                        <span className="text-xs text-muted-foreground font-medium">{sandwich.reviewCount} Reviews</span>
                                    </div>
                                    {sandwich.ingredients && sandwich.ingredients.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-2">
                                            {sandwich.ingredients.slice(0, 5).map(ing => (
                                                <span key={ing} className="px-2 py-0.5 bg-secondary/50 text-secondary-foreground text-[10px] font-medium rounded-full">
                                                    {ing}
                                                </span>
                                            ))}
                                            {sandwich.ingredients.length > 5 && <span className="text-[10px] text-muted-foreground">+{sandwich.ingredients.length - 5} more</span>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-border/20 flex justify-between items-center relative z-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Reference ID</span>
                                    <span className="text-xs font-mono font-bold text-muted-foreground/60">{sandwich.id.slice(0, 16).toUpperCase()}</span>
                                </div>
                                <Link
                                    href={`/sandwich/${sandwich.id}`}
                                    className="px-6 py-2.5 bg-secondary hover:bg-primary hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 shadow-sm"
                                >
                                    Portal
                                    <ArrowUpRight size={14} />
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
