import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

export interface Sandwich {
    id: string;
    name: string;
    restaurantId: string;
    averageRating: number;
    reviewCount: number;
    ingredients?: string[];
    imageUrl?: string;
    allPhotos?: string[];
    createdAt?: any;
}

export async function updateSandwich(id: string, data: Partial<Sandwich>) {
    const sandwichRef = doc(db, 'sandwiches', id);
    await updateDoc(sandwichRef, {
        ...data,
        updatedAt: new Date().toISOString()
    });
}
