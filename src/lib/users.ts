import { db, storage } from './firebase';
import {
    doc,
    getDoc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { UserProfileSchema } from './validation';
import { sanitizeText } from './sanitization';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    location?: string;
    bio?: string;
    badges?: string[];
    lastLogin: unknown;
    createdAt?: unknown;
}

/**
 * Fetches a user profile from Firestore.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return userSnap.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
}

/**
 * Updates a user profile in Firestore.
 */
export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
    // Validate data using Zod
    const validationResult = UserProfileSchema.partial().safeParse(data);
    if (!validationResult.success) {
        const errorMsg = validationResult.error.issues.map(i => i.message).join(', ');
        throw new Error(`Validation failed: ${errorMsg}`);
    }

    const validatedData = validationResult.data;

    try {
        const userRef = doc(db, 'users', uid);
        const updates: any = {
            ...validatedData,
            lastUpdated: serverTimestamp()
        };

        // Sanitize string fields
        if (updates.displayName) updates.displayName = sanitizeText(updates.displayName);
        if (updates.location) updates.location = sanitizeText(updates.location);
        if (updates.bio) updates.bio = sanitizeText(updates.bio);

        await updateDoc(userRef, updates);
        return true;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
}

/**
 * Uploads a user avatar to Firebase Storage and returns the URL.
 */
export async function uploadAvatar(uid: string, file: File): Promise<string> {
    const timestamp = Date.now();
    const storageRef = ref(storage, `avatars/${uid}/${timestamp}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
}
