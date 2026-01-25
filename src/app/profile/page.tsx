'use client';

import { useEffect, useState, useRef } from 'react';
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
import { Loader2, Calendar, MapPin, MessageSquare, Edit3, X, Camera, Check } from 'lucide-react';
import Link from 'next/link';
import ProfileStats from '@/components/ProfileStats';
import ReviewCard from '@/components/ReviewCard';
import { getUserProfile, updateUserProfile, uploadAvatar, UserProfile } from '@/lib/users';

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
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Edit state
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        displayName: '',
        location: '',
        bio: ''
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            fetchInitialData();
        }
    }, [user, authLoading]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchUserReviews(),
                fetchUserProfile()
            ]);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        if (!user) return;
        const profileData = await getUserProfile(user.uid);
        if (profileData) {
            setProfile(profileData);
            setFormData({
                displayName: profileData.displayName || user.displayName || '',
                location: profileData.location || 'Chicago, IL',
                bio: profileData.bio || ''
            });
        }
    };

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
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsSaving(true);
        setFormErrors([]);
        try {
            let photoURL = profile?.photoURL || user.photoURL || '';

            if (avatarFile) {
                photoURL = await uploadAvatar(user.uid, avatarFile);
            }

            await updateUserProfile(user.uid, {
                displayName: formData.displayName,
                location: formData.location,
                bio: formData.bio,
                photoURL
            });

            // Refresh data
            await fetchUserProfile();
            setIsEditing(false);
            setAvatarFile(null);
            setAvatarPreview(null);
        } catch (error: any) {
            console.error('Error saving profile:', error);
            if (error.message?.includes('Validation failed')) {
                setFormErrors(error.message.replace('Validation failed: ', '').split(', '));
            } else {
                alert('Failed to save profile. Please try again.');
            }
        } finally {
            setIsSaving(false);
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

    const displayName = profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Scout';

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-20 px-4 md:px-0">
            {/* Header Section */}
            <div className="bg-breakfast-coffee text-white p-6 md:p-10 rounded-3xl shadow-xl relative overflow-hidden transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                    {/* Avatar Display/Edit */}
                    <div className="relative group">
                        {(avatarPreview || profile?.photoURL || user?.photoURL) ? (
                            <img
                                src={avatarPreview || profile?.photoURL || user?.photoURL || ''}
                                alt="Profile"
                                className={`w-32 h-32 rounded-full border-4 border-breakfast-egg shadow-lg object-cover transition-opacity ${isEditing ? 'opacity-70' : ''}`}
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-4xl font-black text-white border-4 border-breakfast-egg shadow-lg">
                                {displayName.charAt(0).toUpperCase()}
                            </div>
                        )}

                        {isEditing && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Camera className="text-white" size={32} />
                            </button>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                    </div>

                    <div className="flex-1 space-y-4 text-center md:text-left">
                        {isEditing ? (
                            <div className="space-y-4">
                                {formErrors.length > 0 && (
                                    <div className="bg-destructive/20 border border-destructive/30 p-4 rounded-xl mb-4">
                                        <p className="text-white font-bold text-xs mb-1">Please fix the following:</p>
                                        <ul className="list-disc list-inside text-white/70 text-xs">
                                            {formErrors.map((err, i) => <li key={i}>{err}</li>)}
                                        </ul>
                                    </div>
                                )}
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1 block">Display Name</label>
                                    <input
                                        type="text"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                        className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 w-full text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-breakfast-egg"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1 block">Location</label>
                                        <div className="relative">
                                            <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-breakfast-egg" />
                                            <input
                                                type="text"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="bg-white/10 border border-white/20 rounded-xl pl-9 pr-4 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-breakfast-egg"
                                                placeholder="e.g. Chicago, IL"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-white/50 text-sm h-full mt-6">
                                        <Calendar size={16} />
                                        Joined {new Date(user?.metadata.creationTime || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider text-white/50 mb-1 block">Bio</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 w-full text-sm h-24 focus:outline-none focus:ring-2 focus:ring-breakfast-egg resize-none"
                                        placeholder="Add a little bio about your sandwich journey..."
                                    />
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className="bg-breakfast-egg text-breakfast-coffee px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform disabled:opacity-50"
                                    >
                                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setAvatarPreview(null);
                                            setAvatarFile(null);
                                        }}
                                        disabled={isSaving}
                                        className="bg-white/10 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-colors disabled:opacity-50"
                                    >
                                        <X size={18} />
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <h1 className="text-4xl font-black tracking-tight mb-2">
                                        {displayName}
                                    </h1>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/70 text-sm font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={16} className="text-breakfast-egg" />
                                            Joined {new Date(user?.metadata.creationTime || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={16} className="text-breakfast-egg" />
                                            {profile?.location || 'Chicago, IL'}
                                        </div>
                                    </div>
                                </div>

                                {profile?.bio && (
                                    <p className="text-white/80 max-w-2xl leading-relaxed italic border-l-4 border-breakfast-egg/30 pl-4 py-1">
                                        &quot;{profile.bio}&quot;
                                    </p>
                                )}

                                <div className="pt-2">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors border border-white/10"
                                    >
                                        <Edit3 size={16} />
                                        Edit Profile
                                    </button>
                                </div>
                            </>
                        )}
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
                        <p className="text-muted-foreground mb-6">Start your journey by finding a sandwich and leaving your first rating.</p>
                        <Link href="/" className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:scale-105 transition-transform inline-block shadow-lg">
                            Explore Sandwiches
                        </Link>
                    </div>
                )}
            </section>
        </div >
    );
}
