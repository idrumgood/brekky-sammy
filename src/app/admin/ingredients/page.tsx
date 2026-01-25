/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trash2, Search, Loader2, AlertTriangle, Filter } from 'lucide-react';

export default function IngredientsAdmin() {
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        async function fetchIngredients() {
            try {
                const snap = await getDocs(query(collection(db, 'ingredients'), orderBy('name')));
                setIngredients(snap.docs.map(doc => doc.id)); // Using ID which is the name
            } catch (error) {
                console.error("Error fetching ingredients:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchIngredients();
    }, []);

    const handleDelete = async (name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}" from the global ingredient pool? This won't remove it from existing reviews but will stop it appearing in suggestions.`)) return;

        setDeleting(name);
        try {
            await deleteDoc(doc(db, 'ingredients', name));
            setIngredients(prev => prev.filter(i => i !== name));
        } catch (error) {
            console.error("Error deleting ingredient:", error);
            alert("Failed to delete ingredient.");
        } finally {
            setDeleting(null);
        }
    };

    const filtered = ingredients.filter(i => i.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black italic tracking-tighter text-breakfast-coffee mb-2 text-glow">INGREDIENT POOL</h1>
                    <p className="text-muted-foreground text-lg italic">Prune the pantry. Eliminate the &quot;horse&quot;.</p>
                </div>

                <div className="relative w-full lg:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Filter the pantry..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-secondary/30 border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary/50 transition-all outline-none"
                    />
                </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-[1.5rem] flex items-start gap-4 shadow-sm">
                <div className="bg-amber-500 p-2 rounded-xl text-white">
                    <AlertTriangle size={20} />
                </div>
                <div>
                    <p className="text-sm font-bold text-amber-900 mb-1 leading-none uppercase tracking-wider">Curation Warning</p>
                    <p className="text-sm text-amber-800/80">
                        Removing an ingredient only affects <strong>autocomplete suggestions</strong>.
                        Historic reviews containing this item will remain untouched in the archives.
                    </p>
                </div>
            </div>

            <div className="glassmorphism rounded-[2.5rem] p-10 border border-white/10 shadow-2xl min-h-[500px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative w-20 h-20 mb-6">
                            <div className="absolute inset-0 border-8 border-primary/10 rounded-full" />
                            <div className="absolute inset-0 border-8 border-primary border-t-transparent rounded-full animate-spin" />
                            <Filter className="absolute inset-0 m-auto text-primary animate-pulse" size={24} />
                        </div>
                        <p className="text-muted-foreground font-black italic tracking-[0.2em] uppercase">Sifting the Flour...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/30">
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{filtered.length} Ingredients Found</span>
                            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Action</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filtered.map((ingredient) => (
                                <div key={ingredient} className="flex items-center justify-between bg-white/40 dark:bg-black/20 hover:bg-secondary/60 border border-border/40 p-4 rounded-2xl group transition-all hover:scale-[1.02] hover:shadow-md">
                                    <span className="font-bold text-breakfast-coffee">{ingredient}</span>
                                    <button
                                        onClick={() => handleDelete(ingredient)}
                                        disabled={deleting === ingredient}
                                        className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                        title={`Delete ${ingredient}`}
                                    >
                                        {deleting === ingredient ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-center py-32 text-muted-foreground italic font-medium">
                                &quot;No such ingredient exists in these scrolls.&quot;
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="flex justify-center flex-col items-center gap-4 py-8 opacity-50">
                <div className="w-12 h-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Inventory Management v1.0</p>
            </div>
        </div>
    );
}
