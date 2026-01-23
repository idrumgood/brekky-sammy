'use client';

import { useAuth } from '@/lib/AuthContext';
import ReviewForm from '@/components/ReviewForm';
import { Coffee, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function SubmitPage() {
    const { user, isVerified, loading } = useAuth();

    if (loading) return null;

    if (!user) {
        return (
            <div className="max-w-md mx-auto mt-20 text-center space-y-8 p-12 glassmorphism rounded-3xl border border-border">
                <div className="bg-primary/10 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto text-primary">
                    <Coffee size={48} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-breakfast-coffee mb-4">Join the Club!</h1>
                    <p className="text-muted-foreground mb-8 text-lg">You need to be signed in to rate your morning Fuel.</p>
                    <Link
                        href="/login"
                        className="block w-full bg-primary text-white py-4 rounded-2xl font-black text-lg shadow-lg hover:scale-[1.05] transition-transform"
                    >
                        Sign In Now
                    </Link>
                </div>
            </div>
        );
    }

    if (!isVerified) {
        return (
            <div className="max-w-md mx-auto mt-20 text-center space-y-8 p-12 glassmorphism rounded-3xl border border-destructive/20 bg-destructive/5">
                <div className="bg-destructive/10 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto text-destructive">
                    <ShieldAlert size={48} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-breakfast-coffee mb-4">Verification Needed</h1>
                    <p className="text-muted-foreground mb-8 text-lg">Please verify your email address before submitting reviews.</p>
                    <Link
                        href="/profile"
                        className="block w-full bg-secondary text-breakfast-coffee py-4 rounded-2xl font-black text-lg hover:bg-secondary/80 transition-all"
                    >
                        Check Verification Status
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="py-8 space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h1 className="text-5xl font-black text-breakfast-coffee italic">Rate a Sammy</h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                    Found something worth talking about? Share your morning discovery with the club.
                    Your ratings help us find the best eggs in town.
                </p>
            </div>

            <ReviewForm />
        </div>
    );
}
