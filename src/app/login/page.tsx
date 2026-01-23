'use client';

import { useState } from 'react';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { Mail, Lock, Chrome, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
    const { user, isVerified } = useAuth();
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // If already logged in and verified, redirect home
    if (user && isVerified) {
        router.push('/');
        return null;
    }

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            router.push('/');
        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                router.push('/');
            } else {
                // Check if account already exists with different provider
                const methods = await fetchSignInMethodsForEmail(auth, email);
                if (methods.length > 0 && !methods.includes('password')) {
                    setError(`An account already exists with this email using ${methods.join(', ')}. Please sign in with that provider.`);
                    setLoading(false);
                    return;
                }

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(userCredential.user);
                setSuccess('Success! Please check your email to verify your account before logging in.');
                setError(null);
            }
        } catch (err: any) {
            console.error("Auth Error:", err.code, err.message);

            if (err.code === 'auth/account-exists-with-different-credential') {
                setError('An account already exists with this email. Please sign in with Google.');
            } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('Invalid email or password.');
            } else if (err.code === 'auth/configuration-not-found') {
                setError('Authentication configuration error. Please contact support.');
            } else {
                setError(`Error: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 mb-20 p-8 glassmorphism rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    {user && !isVerified ? 'Verify Your Email' : isLogin ? 'Welcome Back' : 'Join the Club'}
                </h1>
                <p className="text-muted-foreground">
                    {user && !isVerified
                        ? "Check your inbox to activate your account."
                        : isLogin
                            ? "Sign in to rate your favorite breakfast sammies."
                            : "Create an account to start your sandwich journey."}
                </p>
            </div>

            {user && !isVerified ? (
                <div className="space-y-4">
                    <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
                        <AlertCircle className="text-primary mt-1" size={20} />
                        <div>
                            <p className="text-sm font-medium">Verification Required</p>
                            <p className="text-sm text-muted-foreground">
                                We've sent a verification email to <strong>{user.email}</strong>.
                                Please click the link in that email to continue.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => auth.currentUser && sendEmailVerification(auth.currentUser)}
                        className="w-full py-2 text-sm text-primary hover:underline"
                    >
                        Resend verification email
                    </button>
                    <button
                        onClick={() => auth.signOut()}
                        className="w-full py-3 bg-secondary hover:bg-secondary/80 rounded-xl transition-colors font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            ) : (
                <>
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white text-black hover:bg-gray-50 py-3 rounded-xl transition-all font-medium border border-border shadow-sm mb-6 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Chrome size={20} />}
                        Continue with Google
                    </button>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground italic">Or use email</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-secondary/50 border border-border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="sammy@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-secondary/50 border border-border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-3 rounded-xl flex items-center gap-2">
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm p-3 rounded-xl flex items-center gap-2">
                                <CheckCircle2 size={16} />
                                {success}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="animate-spin" size={20} />}
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <span className="text-primary font-medium">{isLogin ? 'Sign up' : 'Sign in'}</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
