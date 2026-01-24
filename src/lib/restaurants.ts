import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';

export interface Restaurant {
    id: string;
    name: string;
    location?: string;
    address?: string;
    lat?: number;
    lng?: number;
    website?: string;
}

export async function updateRestaurant(id: string, data: Partial<Restaurant>) {
    const restaurantRef = doc(db, 'restaurants', id);
    await updateDoc(restaurantRef, {
        ...data,
        updatedAt: new Date().toISOString()
    });
}
