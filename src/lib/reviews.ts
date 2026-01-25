import { db, storage } from './firebase';
import {
    collection,
    doc,
    runTransaction,
    serverTimestamp,
    getDocs,
    Transaction,
    DocumentReference
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { cleanIngredient, mergeIngredients } from './utils';

export interface ReviewInput {
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    sandwichId: string;
    restaurantId: string;
    ingredients: string[];
    imageFile?: File;
    newRestaurantName?: string;
    newRestaurantWebsite?: string;
    newSandwichName?: string;
}

export async function uploadReviewImage(file: File, userId: string): Promise<string> {
    const timestamp = Date.now();
    const storageRef = ref(storage, `reviews/${userId}/${timestamp}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
}

async function handleRestaurantLookup(transaction: Transaction, restaurantId: string, input: ReviewInput): Promise<string> {
    if (restaurantId === 'new' && input.newRestaurantName) {
        const restaurantRef = doc(collection(db, 'restaurants'));
        transaction.set(restaurantRef, {
            name: input.newRestaurantName,
            website: input.newRestaurantWebsite || null,
            location: 'Chicago, IL', // Default for now
            createdAt: serverTimestamp()
        });
        return restaurantRef.id;
    }
    return restaurantId;
}

async function handleSandwichUpdate(
    transaction: Transaction,
    sandwichId: string,
    restaurantId: string,
    input: ReviewInput,
    imageUrl: string
): Promise<string> {
    if (sandwichId === 'new' && input.newSandwichName) {
        const sandwichRef = doc(collection(db, 'sandwiches'));
        transaction.set(sandwichRef, {
            name: input.newSandwichName,
            restaurantId: restaurantId,
            averageRating: input.rating,
            reviewCount: 1,
            ingredients: input.ingredients.map(cleanIngredient),
            imageUrl: imageUrl || null,
            allPhotos: imageUrl ? [imageUrl] : [],
            createdAt: serverTimestamp()
        });
        return sandwichRef.id;
    } else {
        const sandwichRef = doc(db, 'sandwiches', sandwichId);
        const sandwichSnap = await transaction.get(sandwichRef);

        if (sandwichSnap.exists()) {
            const data = sandwichSnap.data();
            const newCount = (data.reviewCount || 0) + 1;
            const newAvg = ((data.averageRating || 0) * (data.reviewCount || 0) + input.rating) / newCount;

            const updates: any = {
                reviewCount: newCount,
                averageRating: newAvg,
            };

            if (imageUrl) {
                const photos = data.allPhotos || [];
                updates.allPhotos = [...photos, imageUrl];
                if (!data.imageUrl) {
                    updates.imageUrl = imageUrl;
                }
            }

            const currentIngredients = data.ingredients || [];
            updates.ingredients = mergeIngredients(currentIngredients, input.ingredients);

            transaction.update(sandwichRef, updates);
        }
        return sandwichId;
    }
}

function updateGlobalIngredients(transaction: Transaction, ingredients: string[]) {
    if (ingredients.length === 0) return;
    for (const ingredient of ingredients) {
        const cleaned = cleanIngredient(ingredient);
        if (!cleaned) continue;
        const ingredientRef = doc(db, 'ingredients', cleaned);
        transaction.set(ingredientRef, { name: cleaned }, { merge: true });
    }
}

export async function createReview(input: ReviewInput) {
    let imageUrl = '';

    if (input.imageFile) {
        imageUrl = await uploadReviewImage(input.imageFile, input.userId);
    }

    try {
        return await runTransaction(db, async (transaction) => {
            const finalRestaurantId = await handleRestaurantLookup(transaction, input.restaurantId, input);
            const finalSandwichId = await handleSandwichUpdate(transaction, input.sandwichId, finalRestaurantId, input, imageUrl);

            const reviewRef = doc(collection(db, 'reviews'));
            transaction.set(reviewRef, {
                userId: input.userId,
                userName: input.userName,
                rating: input.rating,
                comment: input.comment,
                sandwichId: finalSandwichId,
                imageUrl: imageUrl || null,
                createdAt: serverTimestamp()
            });

            updateGlobalIngredients(transaction, input.ingredients);

            return { restaurantId: finalRestaurantId, sandwichId: finalSandwichId };
        });
    } catch (error) {
        console.error('Transaction failed: ', error);
        throw error;
    }
}

export async function getGlobalIngredients(): Promise<string[]> {
    const querySnapshot = await getDocs(collection(db, 'ingredients'));
    return querySnapshot.docs.map(doc => doc.data().name);
}
