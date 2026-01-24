import { db } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, MapPin, MessageSquare, Utensils, ArrowLeft, Clock, Info } from 'lucide-react';
import ReviewCard from "@/components/ReviewCard";
import ImageCarousel from "@/components/ImageCarousel";
import EditRestaurantModal from "@/components/EditRestaurantModal";

interface Restaurant {
    id: string;
    name: string;
    location?: string;
    address?: string;
    lat?: number;
    lng?: number;
    website?: string;
}

interface Review {
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    createdAt: string;
}

interface Sandwich {
    id: string;
    name: string;
    restaurantId: string;
    averageRating: number;
    reviewCount: number;
    ingredients?: string[];
    imageUrl?: string;
    allPhotos?: string[];
    restaurant: Restaurant | null;
    reviews: Review[];
}

async function getSandwichData(id: string): Promise<Sandwich | null> {
    const sandwichDoc = await db.collection("sandwiches").doc(id).get();
    if (!sandwichDoc.exists) return null;

    const sandwichData = sandwichDoc.data() as any;
    if (!sandwichData) return null;

    const restaurantDoc = await db.collection("restaurants").doc(sandwichData.restaurantId).get();
    const restaurantData = restaurantDoc.exists ? restaurantDoc.data() as any : null;

    const reviewsSnap = await db.collection("reviews").where("sandwichId", "==", id).get();
    const reviews = reviewsSnap.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            userId: data.userId,
            userName: data.userName,
            rating: data.rating,
            comment: data.comment,
            createdAt: data.createdAt?.toISOString?.() || data.createdAt || null
        };
    }) as Review[];

    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Sanitize objects to remove non-plain fields (like Firestore Timestamps)
    const sanitize = (obj: any) => {
        if (!obj) return null;
        const newObj = { ...obj };
        for (const [key, value] of Object.entries(newObj)) {
            if (value && typeof value === 'object' && 'toDate' in (value as any)) {
                newObj[key] = (value as any).toDate().toISOString();
            } else if (value && typeof value === 'object' && '_seconds' in (value as any)) {
                // Handle case where it might already be partially serialized but still not a "plain object" according to Next.js
                newObj[key] = new Date((value as any)._seconds * 1000).toISOString();
            }
        }
        return newObj;
    };

    return {
        id: sandwichDoc.id,
        ...sanitize(sandwichData),
        restaurant: restaurantData ? { id: restaurantDoc.id, ...sanitize(restaurantData) } : null,
        reviews,
    };
}

export default async function SandwichDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const sandwich = await getSandwichData(id);

    if (!sandwich) {
        notFound();
    }

    return (
        <div className="max-w-6xl mx-auto pb-20 px-4 md:px-0">
            {/* Back Button */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-breakfast-coffee transition-colors mb-6 group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to all sammies
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Image & Basic Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="relative">
                        <ImageCarousel
                            images={sandwich.allPhotos || (sandwich.imageUrl ? [sandwich.imageUrl] : [])}
                            alt={sandwich.name}
                        />
                        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-none">
                            <div className="pointer-events-auto">
                                <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-md">
                                    {sandwich.name}
                                </h1>
                                <div className="flex items-center gap-4 text-white/90">
                                    <div className="flex items-center gap-1">
                                        <Utensils size={18} />
                                        <span className="font-semibold">{sandwich.restaurant?.name || "Unknown Restaurant"}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star size={18} className="text-breakfast-egg fill-breakfast-egg" />
                                        <span className="font-bold">{sandwich.averageRating?.toFixed(1) || "N/A"}</span>
                                        <span className="text-white/70 text-sm">({sandwich.reviewCount || 0} reviews)</span>
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={`/submit?restaurantId=${sandwich.restaurantId}&sandwichId=${sandwich.id}`}
                                className="bg-primary text-white px-6 py-3 rounded-2xl font-black shadow-lg hover:scale-105 transition-transform flex items-center gap-2 pointer-events-auto"
                            >
                                <Star size={20} className="fill-white" />
                                Rate This
                            </Link>
                        </div>
                    </div>

                    {/* Description & Ingredients */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-border">
                        <h2 className="text-2xl font-bold text-breakfast-coffee mb-6 flex items-center gap-2">
                            <Info className="text-primary" />
                            Sammie Details
                        </h2>

                        <div className="space-y-6 text-muted-foreground leading-relaxed">
                            <p>
                                Experience one of the finest breakfast creations at <strong>{sandwich.restaurant?.name}</strong>.
                                This sandwich has earned an impressive <strong>{sandwich.averageRating?.toFixed(1)} star</strong> average across
                                <strong> {sandwich.reviewCount}</strong> authentic reviews from the Sunday Brunch Club.
                            </p>

                            {sandwich.ingredients && sandwich.ingredients.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-breakfast-coffee">Main Ingredients</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {sandwich.ingredients.map((ing: string) => (
                                            <span
                                                key={ing}
                                                className="bg-breakfast-egg/20 text-breakfast-coffee px-3 py-1 rounded-full text-sm font-medium border border-breakfast-egg/30"
                                            >
                                                {ing}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-breakfast-coffee flex items-center gap-2">
                                <MessageSquare className="text-primary" />
                                Member Reviews
                            </h2>
                            <div className="text-sm text-muted-foreground font-medium">
                                Showing {sandwich.reviews.length} reviews
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sandwich.reviews.length > 0 ? (
                                sandwich.reviews.map((review: any) => (
                                    <ReviewCard
                                        key={review.id}
                                        userId={review.userId}
                                        userName={review.userName}
                                        rating={review.rating}
                                        comment={review.comment}
                                        createdAt={review.createdAt}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-12 text-center bg-secondary/20 rounded-2xl border-2 border-dashed border-border">
                                    <p className="text-muted-foreground">No reviews yet for this sammie.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>



                {/* Right Column: Restaurant Sidebar */}
                <div className="space-y-6">
                    <div className="bg-breakfast-coffee text-white rounded-3xl p-8 sticky top-24 relative group">
                        {sandwich.restaurant && (
                            <div className="absolute top-4 right-4">
                                <EditRestaurantModal restaurant={sandwich.restaurant} />
                            </div>
                        )}
                        <h3 className="text-xl font-bold mb-6">About the Restaurant</h3>

                        <div className="space-y-6">
                            <div>
                                <h4 className="text-breakfast-egg font-bold text-lg mb-1">{sandwich.restaurant?.name}</h4>
                                <div className="space-y-1">
                                    <div className="flex items-start gap-2 text-white/80 text-sm">
                                        <MapPin size={16} className="shrink-0 mt-0.5" />
                                        <span>{sandwich.restaurant?.location || "Location not available"}</span>
                                    </div>
                                    {sandwich.restaurant?.address && (
                                        <div className="text-white/60 text-xs pl-6">
                                            {sandwich.restaurant.address}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {sandwich.restaurant?.website && (
                                <a
                                    href={sandwich.restaurant.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center bg-breakfast-egg text-breakfast-coffee font-bold py-3 rounded-xl hover:bg-white transition-colors"
                                >
                                    Visit Website
                                </a>
                            )}

                            <hr className="border-white/10" />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Clock size={16} />
                                        <span>Sunday Brunch Club</span>
                                    </div>
                                    <span className="text-breakfast-egg font-bold">Member</span>
                                </div>
                                <p className="text-xs text-white/60 italic leading-relaxed">
                                    This restaurant has been vetted and rated by our community of breakfast sandwich enthusiasts.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
