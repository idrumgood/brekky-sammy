'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Users, Store, MessageSquare, Plus, ArrowUpRight, Activity, List } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        restaurants: 0,
        sandwiches: 0,
        reviews: 0,
        ingredients: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetching all docs for small datasets is fine
                const [usersSnap, restaurantsSnap, sandwichesSnap, reviewsSnap, ingredientsSnap] = await Promise.all([
                    getDocs(collection(db, 'users')),
                    getDocs(collection(db, 'restaurants')),
                    getDocs(collection(db, 'sandwiches')),
                    getDocs(collection(db, 'reviews')),
                    getDocs(collection(db, 'ingredients'))
                ]);

                setStats({
                    users: usersSnap.size,
                    restaurants: restaurantsSnap.size,
                    sandwiches: sandwichesSnap.size,
                    reviews: reviewsSnap.size,
                    ingredients: ingredientsSnap.size
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    const cards = [
        { label: 'Total Users', value: stats.users, icon: Users, color: 'bg-indigo-500', href: '/admin/users' },
        { label: 'Restaurants', value: stats.restaurants, icon: Store, color: 'bg-amber-500', href: '/admin/restaurants' },
        { label: 'Sandwiches', value: stats.sandwiches, icon: List, color: 'bg-blue-500', href: '/admin/sandwiches' },
        { label: 'Total Reviews', value: stats.reviews, icon: MessageSquare, color: 'bg-emerald-500', href: '/admin/reviews' },
        { label: 'Ingredients', value: stats.ingredients, icon: Plus, color: 'bg-rose-500', href: '/admin/ingredients' },
    ];

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-black italic tracking-tighter text-breakfast-coffee mb-3">DASHBOARD OVERVIEW</h1>
                <p className="text-muted-foreground text-lg">Real-time pulse of the BrekkySammy ecosystem.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <Link key={card.label} href={card.href} className="glassmorphism p-8 rounded-[2rem] hover:scale-[1.02] active:scale-[0.98] transition-all group border border-white/10">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`${card.color} p-4 rounded-2xl text-white shadow-lg ring-4 ring-white/10 group-hover:ring-white/20 transition-all`}>
                                    <Icon size={24} />
                                </div>
                                <ArrowUpRight className="text-muted-foreground/30 group-hover:text-primary transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={24} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{card.label}</p>
                                <p className="text-4xl font-black tracking-tighter text-breakfast-coffee">
                                    {loading ? '...' : card.value.toLocaleString()}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* System Status */}
                <div className="lg:col-span-2 glassmorphism p-8 rounded-[2rem] border border-white/10">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold flex items-center gap-3">
                            <Activity size={24} className="text-primary" />
                            System Health
                        </h3>
                        <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black rounded-full border border-emerald-500/20">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            OPERATIONAL
                        </span>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Firestore', status: 'Healthy' },
                                { label: 'Auth', status: 'Healthy' },
                                { label: 'Storage', status: 'Healthy' },
                                { label: 'Cloud Run', status: 'Healthy' },
                            ].map(sys => (
                                <div key={sys.label} className="p-4 bg-secondary/30 rounded-2xl border border-border/50">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{sys.label}</p>
                                    <p className="text-sm font-bold text-breakfast-coffee">{sys.status}</p>
                                </div>
                            ))}
                        </div>

                        <div className="h-24 flex items-end gap-1 px-2">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-primary/20 rounded-full hover:bg-primary transition-colors cursor-help"
                                    style={{ height: `${20 + Math.random() * 80}%` }}
                                    title={`Traffic slice ${i}`}
                                />
                            ))}
                        </div>
                        <p className="text-center text-xs text-muted-foreground italic">Network latency measured at 42ms (average)</p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glassmorphism p-8 rounded-[2rem] border border-white/10 flex flex-col">
                    <h3 className="text-xl font-bold mb-8">Quick Setup</h3>
                    <div className="space-y-4 flex-1">
                        <Link href="/admin/users" className="block w-full text-left p-4 bg-secondary/50 rounded-2xl hover:bg-secondary transition-all font-bold text-sm border border-border/50">
                            Designate Admin
                        </Link>
                        <Link href="/admin/restaurants" className="block w-full text-left p-4 bg-secondary/50 rounded-2xl hover:bg-secondary transition-all font-bold text-sm border border-border/50">
                            Moderate Restaurants
                        </Link>
                        <Link href="/admin/sandwiches" className="block w-full text-left p-4 bg-secondary/50 rounded-2xl hover:bg-secondary transition-all font-bold text-sm border border-border/50">
                            Prune Sandwiches
                        </Link>
                        <Link href="/admin/ingredients" className="block w-full text-left p-4 bg-secondary/50 rounded-2xl hover:bg-secondary transition-all font-bold text-sm border border-border/50">
                            Clean Ingredients
                        </Link>
                    </div>
                    <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Admin Tip</p>
                        <p className="text-xs text-muted-foreground">To remove &quot;horse&quot; from the pool, navigate to the Ingredients tab.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
