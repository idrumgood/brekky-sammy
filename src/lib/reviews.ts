import { db, storage } from './firebase';
import {
    collection,
    doc,
    runTransaction,
    serverTimestamp,
    getDocs,
    setDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ReviewInput {
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    sandwichId: string;
    restaurantId: string;
    ingredients: string[];
    imageFile?: File;
    // For new restaurants/sandwiches
    newRestaurantName?: string;
    newRestaurantWebsite?: string; // Added
    newSandwichName?: string;
}

export async function uploadReviewImage(file: File, userId: string): Promise<string> {
    const timestamp = Date.now();
    const storageRef = ref(storage, `reviews/${userId}/${timestamp}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
}

export async function createReview(input: ReviewInput) {
    let finalRestaurantId = input.restaurantId;
    let finalSandwichId = input.sandwichId;
    let imageUrl = '';

    if (input.imageFile) {
        imageUrl = await uploadReviewImage(input.imageFile, input.userId);
    }

    return await runTransaction(db, async (transaction) => {
        // 1. Handle New Restaurant
        if (finalRestaurantId === 'new' && input.newRestaurantName) {
            const restaurantRef = doc(collection(db, 'restaurants'));
            finalRestaurantId = restaurantRef.id;
            transaction.set(restaurantRef, {
                name: input.newRestaurantName,
                website: input.newRestaurantWebsite || null, // Added
                location: 'Chicago, IL', // Default for now
                createdAt: serverTimestamp()
            });
        }

        // 2. Handle New Sandwich
        if (finalSandwichId === 'new' && input.newSandwichName) {
            const sandwichRef = doc(collection(db, 'sandwiches'));
            finalSandwichId = sandwichRef.id;
            transaction.set(sandwichRef, {
                name: input.newSandwichName,
                restaurantId: finalRestaurantId,
                averageRating: input.rating,
                reviewCount: 1,
                ingredients: input.ingredients,
                imageUrl: imageUrl || null,
                allPhotos: imageUrl ? [imageUrl] : [],
                createdAt: serverTimestamp()
            });
        } else {
            // 3. Update Existing Sandwich
            const sandwichRef = doc(db, 'sandwiches', finalSandwichId);
            const sandwichSnap = await transaction.get(sandwichRef);

            if (sandwichSnap.exists()) {
                const data = sandwichSnap.data();
                const newCount = (data.reviewCount || 0) + 1;
                const newAvg = ((data.averageRating || 0) * (data.reviewCount || 0) + input.rating) / newCount;

                const updates: any = {
                    reviewCount: newCount,
                    averageRating: newAvg,
                };

                // Add to photo gallery if present
                if (imageUrl) {
                    const photos = data.allPhotos || [];
                    updates.allPhotos = [...photos, imageUrl];
                    // Set primary image if none exists
                    if (!data.imageUrl) {
                        updates.imageUrl = imageUrl;
                    }
                }

                // Merge ingredients (add variety over time)
                const currentIngredients = data.ingredients || [];
                const mergedIngredients = Array.from(new Set([...currentIngredients, ...input.ingredients]));
                updates.ingredients = mergedIngredients;

                transaction.update(sandwichRef, updates);
            }
        }

        // 4. Create Review Document
        const reviewRef = doc(collection(db, 'reviews'));
        transaction.set(reviewRef, {
            userId: input.userId,
            userName: input.userName,
            rating: input.rating,
            comment: input.comment,
            sandwichId: finalSandwichId,
            imageUrl: imageUrl || null,
            createdAt: new Date().toISOString() // Using string date as per existing data model
        });

        // 5. Update Global Ingredients Pool
        if (input.ingredients.length > 0) {
            for (const ingredient of input.ingredients) {
                const ingredientRef = doc(db, 'ingredients', ingredient.toLowerCase().trim());
                transaction.set(ingredientRef, { name: ingredient.toLowerCase().trim() }, { merge: true });
            }
        }

        return { restaurantId: finalRestaurantId, sandwichId: finalSandwichId };
    });
}

export async function getGlobalIngredients(): Promise<string[]> {
    const querySnapshot = await getDocs(collection(db, 'ingredients'));
    return querySnapshot.docs.map(doc => doc.data().name);
}
