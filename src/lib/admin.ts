import { db } from './firebase';
import {
    collection,
    doc,
    getDocs,
    query,
    where,
    deleteDoc,
    writeBatch
} from 'firebase/firestore';

/**
 * Deletes all reviews for a specific sandwich.
 */
export async function deleteSandwichReviews(sandwichId: string) {
    const reviewsRef = collection(db, 'reviews');
    const q = query(reviewsRef, where('sandwichId', '==', sandwichId));
    const snap = await getDocs(q);

    if (snap.empty) return;

    const batch = writeBatch(db);
    snap.docs.forEach((reviewDoc) => {
        batch.delete(reviewDoc.ref);
    });

    await batch.commit();
}

/**
 * Deletes a sandwich and all its associated reviews.
 */
export async function deleteSandwichCascading(sandwichId: string) {
    // 1. Delete all reviews
    await deleteSandwichReviews(sandwichId);

    // 2. Delete the sandwich itself
    await deleteDoc(doc(db, 'sandwiches', sandwichId));
}

/**
 * Deletes all sandwiches and their reviews for a specific restaurant.
 */
export async function deleteRestaurantSandwiches(restaurantId: string) {
    const sandwichesRef = collection(db, 'sandwiches');
    const q = query(sandwichesRef, where('restaurantId', '==', restaurantId));
    const snap = await getDocs(q);

    if (snap.empty) return;

    // Delete each sandwich and its reviews
    // We do this sequentially to avoid hitting batch limits if there are many sandwiches/reviews
    // and because deleteSandwichCascading handles its own batching for reviews.
    for (const sandwichDoc of snap.docs) {
        await deleteSandwichCascading(sandwichDoc.id);
    }
}

/**
 * Deletes a restaurant, all its sandwiches, and all associated reviews.
 */
export async function deleteRestaurantCascading(restaurantId: string) {
    // 1. Delete all sandwiches and their reviews
    await deleteRestaurantSandwiches(restaurantId);

    // 2. Delete the restaurant itself
    await deleteDoc(doc(db, 'restaurants', restaurantId));
}
