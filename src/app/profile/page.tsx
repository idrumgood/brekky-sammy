'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import {
    collection,
    query,
    where,
    getDocs,
    getDoc,
    doc
} from 'firebase/firestore';
import { Loader2, Calendar, Utensils, Star, MapPin, ChevronRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import ProfileStats from '@/components/ProfileStats';

interface Review {
    id: string;
    sandwichId: string;
    rating: number;
    comment: string;
    createdAt: string;
    sandwichName?: string;
    restaurantName?: string;
}

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            fetchUserReviews();
        }
    }, [user, authLoading]);

    const fetchUserReviews = async () => {
        try {
            // Fetch reviews attributed to this user ID
            const reviewsQuery = query(
                collection(db, 'reviews'),
                where('userId', '==', user?.uid)
            );

            const querySnapshot = await getDocs(reviewsQuery);
            const reviewsData = await Promise.all(querySnapshot.docs.map(async (reviewDoc) => {
                const data = reviewDoc.data();

                // Fetch sandwich and restaurant names for context
                const sandwichDoc = await getDoc(doc(db, 'sandwiches', data.sandwichId));
                const sandwichData = sandwichDoc.data();

                let restaurantName = 'Unknown Restaurant';
                if (sandwichData?.restaurantId) {
                    const restaurantDoc = await getDoc(doc(db, 'restaurants', sandwichData.restaurantId));
                    restaurantName = restaurantDoc.data()?.name || 'Unknown Restaurant';
                }

                return {
                    id: reviewDoc.id,
                    ...data,
                    sandwichName: sandwichData?.name || 'Unknown Sandwich',
                    restaurantName
                } as Review;
            }));

            // Sort by date descending
            reviewsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setReviews(reviewsData);
        } catch (error) {
            console.error('Error fetching user reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-muted-foreground font-medium">Loading your profile...</p>
            </div>
        );
    }

    const avgRating = reviews.length > 0
        ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
        : 0;

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-breakfast-coffee text-white p-10 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                {user?.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-32 h-32 rounded-full border-4 border-breakfast-egg shadow-lg relative z-10"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-4xl font-black text-white border-4 border-breakfast-egg shadow-lg relative z-10">
                        {(user?.displayName || user?.email)?.[0].toUpperCase()}
                    </div>
                )}

                <div className="text-center md:text-left relative z-10">
                    <h1 className="text-4xl font-black tracking-tight mb-2">
                        {user?.displayName || user?.email?.split('@')[0]}
                    </h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/70 text-sm font-medium">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={16} className="text-breakfast-egg" />
                            Joined {new Date(user?.metadata.creationTime || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-breakfast-egg" />
                            Chicago, IL
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Dashboard */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-breakfast-coffee">Club Stats</h2>
                <ProfileStats totalReviews={reviews.length} averageRating={avgRating} />
            </section>

            {/* Review History */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-breakfast-coffee">Rating History</h2>
                    <span className="text-sm font-medium text-muted-foreground">{reviews.length} total entries</span>
                </div>

                {reviews.length > 0 ? (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <Link
                                key={review.id}
                                href={`/sandwich/${review.sandwichId}`}
                                className="block group"
                            >
                                <div className="bg-white border border-border p-6 rounded-2xl shadow-sm group-hover:shadow-md group-hover:border-primary/20 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-secondary/50 p-3 rounded-xl text-primary group-hover:scale-110 transition-transform">
                                            <Utensils size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-breakfast-coffee group-hover:text-primary transition-colors leading-tight mb-1">
                                                {review.sandwichName}
                                            </h3>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                {review.restaurantName}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8">
                                        <div className="text-right">
                                            <div className="flex items-center justify-end gap-1 mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        size={14}
                                                        className={i < review.rating ? 'fill-breakfast-egg text-breakfast-egg' : 'text-gray-200'}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <ChevronRight size={20} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-secondary/20 border-2 border-dashed border-border rounded-3xl p-16 text-center">
                        <MessageSquare className="mx-auto text-muted-foreground/30 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-breakfast-coffee mb-2">No reviews yet!</h3>
                        <p className="text-muted-foreground mb-6">Start your journey by finding a sandwich and leaving your first rating.</p>
                        <Link href="/" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-transform inline-block shadow-lg">
                            Explore Sandwiches
                        </Link>
                    </div>
                )}
            </section>
        </div>
    );
}
