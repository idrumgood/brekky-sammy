'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Trash2, MessageSquare, Loader2, Star, User, Store, Calendar } from 'lucide-react';

interface ReviewData {
    id: string;
    sandwichName: string;
    restaurantName: string;
    rating: number;
    userName: string;
    comment: string;
    createdAt: any;
}

export default function ReviewsAdmin() {
    const [reviews, setReviews] = useState<ReviewData[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        async function fetchReviews() {
            try {
                // Fetch recent reviews for moderation
                const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(50));
                const snap = await getDocs(q);
                setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReviewData)));
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchReviews();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review? This action is permanent.")) return;

        setDeleting(id);
        try {
            await deleteDoc(doc(db, 'reviews', id));
            setReviews(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error("Error deleting review:", error);
            alert("Failed to delete review.");
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-4xl font-black italic tracking-tighter text-breakfast-coffee mb-2">MODERATION FEED</h1>
                <p className="text-muted-foreground text-lg">The thin line between community and chaos.</p>
            </div>

            <div className="glassmorphism rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden bg-white/5">
                <div className="divide-y divide-border/20">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40">
                            <div className="relative w-24 h-24 mb-6">
                                <div className="absolute inset-0 border-8 border-primary/10 rounded-full" />
                                <div className="absolute inset-0 border-8 border-primary border-r-transparent rounded-full animate-spin" />
                                <MessageSquare className="absolute inset-0 m-auto text-primary animate-bounce" size={28} />
                            </div>
                            <p className="text-muted-foreground font-black italic tracking-[0.3em] uppercase">Checking the Logs...</p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="py-40 text-center flex flex-col items-center gap-4">
                            <div className="bg-secondary/50 p-6 rounded-full text-muted-foreground/30">
                                <MessageSquare size={48} />
                            </div>
                            <p className="text-muted-foreground italic font-medium">The scrolls are empty. Peace reigns.</p>
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="p-10 hover:bg-white/5 transition-all flex flex-col xl:flex-row gap-8 group relative overflow-hidden">
                                {/* Delete Overlay for Group Hover */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                                        <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full shadow-lg shadow-primary/20 scale-110">
                                            <Star className="fill-current" size={14} strokeWidth={3} />
                                            <span className="font-black text-sm">{review.rating.toFixed(1)}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-black text-breakfast-coffee tracking-tight leading-none">{review.sandwichName}</h3>
                                            <div className="flex items-center gap-2 text-muted-foreground text-xs font-bold uppercase tracking-widest">
                                                <Store size={12} className="text-primary" />
                                                {review.restaurantName}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <p className="text-lg font-medium text-breakfast-coffee leading-relaxed italic opacity-90 relative z-10 pl-8 border-l-4 border-primary/30 py-2">
                                            "{review.comment}"
                                        </p>
                                        <MessageSquare className="absolute -top-4 -left-2 text-primary/5 -z-0" size={80} />
                                    </div>

                                    <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em]">
                                        <div className="flex items-center gap-2">
                                            <User size={12} className="text-primary/50" />
                                            FROM: {review.userName}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12} className="text-primary/50" />
                                            DATE: {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'JUST NOW'}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-border rounded-full" />
                                            ID: {review.id.slice(0, 8)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end xl:w-24 border-t xl:border-t-0 xl:border-l border-border/20 pt-6 xl:pt-0">
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        disabled={deleting === review.id}
                                        className="w-full xl:w-auto p-5 bg-destructive/10 text-destructive hover:bg-destructive hover:text-white rounded-[1.5rem] transition-all transform hover:scale-110 active:scale-90 disabled:opacity-50 shadow-sm"
                                        title="Delete Review"
                                    >
                                        {deleting === review.id ? <Loader2 className="animate-spin" size={24} /> : <Trash2 size={24} />}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="text-center opacity-30 pb-10">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">End of Moderation Logs</p>
            </div>
        </div>
    );
}
