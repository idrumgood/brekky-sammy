'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    onAuthStateChanged,
    signOut as firebaseSignOut
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isVerified: boolean;
    isAdmin: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isVerified: false,
    isAdmin: false,
    signOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            setUser(authUser);
            if (authUser) {
                try {
                    // Sync user metadata to Firestore
                    const userRef = doc(db, 'users', authUser.uid);
                    await setDoc(userRef, {
                        uid: authUser.uid,
                        email: authUser.email,
                        displayName: authUser.displayName || '',
                        photoURL: authUser.photoURL || '',
                        lastLogin: serverTimestamp(),
                    }, { merge: true });

                    // Fetch role
                    const userDoc = await getDoc(userRef);
                    if (userDoc.exists()) {
                        setIsAdmin(userDoc.data().role === 'admin');
                    } else {
                        setIsAdmin(false);
                    }
                } catch (error) {
                    console.error('Error syncing user/fetching role:', error);
                    setIsAdmin(false);
                }
            } else {
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isVerified: user?.emailVerified || false,
            isAdmin,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
