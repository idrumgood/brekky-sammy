import { db } from "@/lib/firebase-admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, MapPin, MessageSquare, ArrowLeft, Calendar } from 'lucide-react';
import ReviewCard from "@/components/ReviewCard";
import ProfileStats from "@/components/ProfileStats";
import { sanitizeText } from "@/lib/sanitization";

export const dynamic = "force-dynamic";

async function getUserData(uid: string) {
    const userDoc = await db.collection("users").doc(uid).get();
    if (!userDoc.exists) return null;

    const userData = userDoc.data();

    // Fetch user reviews
    const reviewsSnap = await db.collection("reviews").where("userId", "==", uid).get();
    const reviews = await Promise.all(reviewsSnap.docs.map(async (doc) => {
        const data = doc.data();

        // Fetch sandwich and restaurant info for context
        const sandwichDoc = await db.collection("sandwiches").doc(data.sandwichId).get();
        const sandwichData = sandwichDoc.exists ? sandwichDoc.data() : null;

        let restaurantName = "Unknown Restaurant";
        if (sandwichData?.restaurantId) {
            const restaurantDoc = await db.collection("restaurants").doc(sandwichData.restaurantId).get();
            restaurantName = restaurantDoc.exists ? restaurantDoc.data()?.name : "Unknown Restaurant";
        }

        return {
            id: doc.id,
            sandwichId: data.sandwichId,
            sandwichName: sandwichData?.name || "Unknown Sandwich",
            restaurantName,
            rating: data.rating,
            comment: data.comment,
            createdAt: data.createdAt?.toISOString?.() || data.createdAt || new Date().toISOString()
        };
    }));

    reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Sanitize user data
    const sanitizedUser = {
        uid,
        displayName: sanitizeText(userData?.displayName || "Anonymous Scout"),
        photoURL: userData?.photoURL || null,
        location: sanitizeText(userData?.location || "Chicago, IL"),
        bio: userData?.bio ? sanitizeText(userData.bio) : null,
        createdAt: userData?.createdAt?.toDate?.()?.toISOString() || userData?.createdAt || null
    };

    return {
        user: sanitizedUser,
        reviews
    };
}

export default async function PublicProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const data = await getUserData(id);

    if (!data) {
        notFound();
    }

    const { user, reviews } = data;
    const avgRating = reviews.length > 0
        ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
        : 0;

    return (
        <div className="max-w-5xl mx-auto space-y-12 px-4 md:px-0 mb-20">
            {/* Back Button */}
            <Link
                href="/search"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-breakfast-coffee transition-colors group"
            >
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Back to all sammys
            </Link>

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-breakfast-coffee text-white p-10 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                {user.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="w-32 h-32 rounded-full border-4 border-breakfast-egg shadow-lg relative z-10 object-cover"
                    />
                ) : (
                    <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-4xl font-black text-white border-4 border-breakfast-egg shadow-lg relative z-10">
                        {user.displayName.charAt(0).toUpperCase()}
                    </div>
                )}

                <div className="text-center md:text-left relative z-10 flex-1">
                    <h1 className="text-4xl font-black tracking-tight mb-2">
                        {user.displayName}
                    </h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/70 text-sm font-medium mb-4">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-breakfast-egg" />
                            {user.location}
                        </div>
                        {user.createdAt && (
                            <div className="flex items-center gap-1.5">
                                <Calendar size={16} className="text-breakfast-egg" />
                                Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </div>
                        )}
                    </div>
                    {user.bio && (
                        <p className="text-white/80 max-w-2xl leading-relaxed italic">
                            &quot;{user.bio}&quot;
                        </p>
                    )}
                </div>
            </div>

            {/* Stats */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-breakfast-coffee flex items-center gap-2">
                    <Star className="text-primary" />
                    Club Stats
                </h2>
                <ProfileStats totalReviews={reviews.length} averageRating={avgRating} />
            </section>

            {/* Reviews */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-breakfast-coffee flex items-center gap-2">
                        <MessageSquare className="text-primary" />
                        Rating History
                    </h2>
                    <span className="text-sm font-medium text-muted-foreground">{reviews.length} total entries</span>
                </div>

                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((review) => (
                            <ReviewCard
                                key={review.id}
                                title={review.sandwichName}
                                subtitle={new Date(review.createdAt).toLocaleDateString()}
                                rating={review.rating}
                                comment={review.comment}
                                createdAt={review.createdAt}
                                footer={`At ${review.restaurantName}`}
                                actionLink={{
                                    href: `/sandwich/${review.sandwichId}`,
                                    label: 'View Sammy'
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-secondary/20 border-2 border-dashed border-border rounded-3xl p-16 text-center">
                        <MessageSquare className="mx-auto text-muted-foreground/30 mb-4" size={48} />
                        <h3 className="text-xl font-bold text-breakfast-coffee mb-2">No reviews yet!</h3>
                        <p className="text-muted-foreground">This scout hasn&apos;t posted any reviews yet.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
