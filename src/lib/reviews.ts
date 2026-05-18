import { db, storage } from './firebase';
import {
    collection,
    doc,
    runTransaction,
    serverTimestamp,
    getDocs,
    Transaction
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { cleanIngredient, mergeIngredients } from './utils';
import { ReviewSchema, ReviewInput } from './validation';
import { sanitizeText, sanitizeUrl } from './sanitization';
import { updateUserBadges } from './badges';
import { generateSandwichDescription } from './gemini';
import { query, where, getDoc, updateDoc } from 'firebase/firestore';

// ReviewInput is now imported from ./validation

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
            name: sanitizeText(input.newRestaurantName),
            website: input.newRestaurantWebsite ? sanitizeUrl(input.newRestaurantWebsite) : null,
            address: input.newRestaurantAddress ? sanitizeText(input.newRestaurantAddress) : null,
            lat: input.newRestaurantLat || null,
            lng: input.newRestaurantLng || null,
            location: 'Chicago, IL', // Default display location
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
            name: sanitizeText(input.newSandwichName),
            restaurantId: restaurantId,
            averageRating: input.rating,
            reviewCount: 1,
            ingredients: input.ingredients.map(cleanIngredient).map(sanitizeText),
            imageUrl: imageUrl || null,
            allPhotos: imageUrl ? [imageUrl] : [],
            createdAt: serverTimestamp(),
            lastReviewedAt: serverTimestamp()
        });
        return sandwichRef.id;
    } else {
        const sandwichRef = doc(db, 'sandwiches', sandwichId);
        const sandwichSnap = await transaction.get(sandwichRef);

        if (sandwichSnap.exists()) {
            const data = sandwichSnap.data();
            const newCount = (data.reviewCount || 0) + 1;
            const newAvg = ((data.averageRating || 0) * (data.reviewCount || 0) + input.rating) / newCount;

            const updates: {
                reviewCount: number;
                averageRating: number;
                lastReviewedAt: any;
                allPhotos?: string[];
                imageUrl?: string;
                ingredients?: string[];
            } = {
                reviewCount: newCount,
                averageRating: newAvg,
                lastReviewedAt: serverTimestamp(),
            };

            if (imageUrl) {
                const photos = data.allPhotos || [];
                updates.allPhotos = [...photos, imageUrl];
                if (!data.imageUrl) {
                    updates.imageUrl = imageUrl;
                }
            }

            const currentIngredients = data.ingredients || [];
            const sanitizedNewIngredients = input.ingredients.map(sanitizeText);
            updates.ingredients = mergeIngredients(currentIngredients, sanitizedNewIngredients);

            transaction.update(sandwichRef, updates);
        }
        return sandwichId;
    }
}

function updateGlobalIngredients(transaction: Transaction, ingredients: string[]) {
    if (ingredients.length === 0) return;
    for (const ingredient of ingredients) {
        const cleaned = cleanIngredient(ingredient);
        const sanitized = sanitizeText(cleaned);
        if (!sanitized) continue;
        const ingredientRef = doc(db, 'ingredients', sanitized);
        transaction.set(ingredientRef, { name: sanitized }, { merge: true });
    }
}

export async function createReview(input: ReviewInput) {
    // Validate input using Zod before any operations
    const validationResult = ReviewSchema.safeParse(input);
    if (!validationResult.success) {
        const errorMsg = validationResult.error.issues.map(i => i.message).join(', ');
        throw new Error(`Validation failed: ${errorMsg}`);
    }

    const validatedInput = validationResult.data;
    let imageUrl = '';

    if (input.imageFile) {
        imageUrl = await uploadReviewImage(input.imageFile, validatedInput.userId);
    }

    try {
        const result = await runTransaction(db, async (transaction) => {
            const finalRestaurantId = await handleRestaurantLookup(transaction, validatedInput.restaurantId, validatedInput);
            const finalSandwichId = await handleSandwichUpdate(transaction, validatedInput.sandwichId, finalRestaurantId, validatedInput, imageUrl);

            const reviewRef = doc(collection(db, 'reviews'));
            transaction.set(reviewRef, {
                userId: validatedInput.userId,
                userName: sanitizeText(validatedInput.userName),
                rating: validatedInput.rating,
                comment: sanitizeText(validatedInput.comment),
                sandwichId: finalSandwichId,
                imageUrl: imageUrl || null,
                createdAt: serverTimestamp()
            });

            updateGlobalIngredients(transaction, validatedInput.ingredients);

            return { restaurantId: finalRestaurantId, sandwichId: finalSandwichId };
        });

        // Award badges asynchronously
        const newAchievements: string[] = [];
        if (validatedInput.restaurantId === 'new') newAchievements.push('first_restaurant');
        if (validatedInput.sandwichId === 'new') newAchievements.push('first_sandwich');

        updateUserBadges(validatedInput.userId, newAchievements).catch(err => console.error('Error awarding badges:', err));

        // Update sandwich description asynchronously
        updateSandwichDescription(result.sandwichId).catch(err => console.error('Error updating sandwich description:', err));

        return result;
    } catch (error) {
        console.error('Transaction failed: ', error);
        throw error;
    }
}

export async function updateReview(reviewId: string, input: ReviewInput) {
    const validationResult = ReviewSchema.safeParse(input);
    if (!validationResult.success) {
        const errorMsg = validationResult.error.issues.map(i => i.message).join(', ');
        throw new Error(`Validation failed: ${errorMsg}`);
    }

    const validatedInput = validationResult.data;
    let imageUrl = '';

    if (input.imageFile) {
        imageUrl = await uploadReviewImage(input.imageFile, validatedInput.userId);
    }

    try {
        await runTransaction(db, async (transaction) => {
            const reviewRef = doc(db, 'reviews', reviewId);
            const reviewSnap = await transaction.get(reviewRef);
            if (!reviewSnap.exists()) throw new Error('Review not found');
            const oldReviewData = reviewSnap.data();

            if (oldReviewData.userId !== validatedInput.userId) {
                throw new Error('Unauthorized');
            }

            const sandwichRef = doc(db, 'sandwiches', oldReviewData.sandwichId);
            const sandwichSnap = await transaction.get(sandwichRef);

            if (sandwichSnap.exists()) {
                const sandwichData = sandwichSnap.data();
                const count = sandwichData.reviewCount || 1;
                const currentAvg = sandwichData.averageRating || 0;

                // Recalculate average: (total - old + new) / count
                const newAvg = ((currentAvg * count) - oldReviewData.rating + validatedInput.rating) / count;

                const sandwichUpdates: any = {
                    averageRating: newAvg,
                };

                if (imageUrl) {
                    let photos = sandwichData.allPhotos || [];
                    if (oldReviewData.imageUrl) {
                        photos = photos.map((p: string) => p === oldReviewData.imageUrl ? imageUrl : p);
                    } else {
                        photos = [...photos, imageUrl];
                    }
                    sandwichUpdates.allPhotos = photos;

                    if (sandwichData.imageUrl === oldReviewData.imageUrl || !sandwichData.imageUrl) {
                        sandwichUpdates.imageUrl = imageUrl;
                    }
                }

                const currentIngredients = sandwichData.ingredients || [];
                const sanitizedNewIngredients = validatedInput.ingredients.map(sanitizeText);
                sandwichUpdates.ingredients = mergeIngredients(currentIngredients, sanitizedNewIngredients);

                transaction.update(sandwichRef, sandwichUpdates);
            }

            const reviewUpdates: any = {
                rating: validatedInput.rating,
                comment: sanitizeText(validatedInput.comment),
                updatedAt: serverTimestamp()
            };
            if (imageUrl) {
                reviewUpdates.imageUrl = imageUrl;
            }

            transaction.update(reviewRef, reviewUpdates);
            updateGlobalIngredients(transaction, validatedInput.ingredients);
        });
    } catch (error) {
        console.error('Transaction failed: ', error);
        throw error;
    }
}

export async function updateSandwichDescription(sandwichId: string) {
    try {
        // 1. Get sandwich data
        const sandwichRef = doc(db, 'sandwiches', sandwichId);
        const sandwichSnap = await getDoc(sandwichRef);
        if (!sandwichSnap.exists()) return;
        const sandwichData = sandwichSnap.data();

        // 2. Get restaurant name
        const restaurantRef = doc(db, 'restaurants', sandwichData.restaurantId);
        const restaurantSnap = await getDoc(restaurantRef);
        const restaurantName = restaurantSnap.exists() ? restaurantSnap.data().name : 'Unknown Restaurant';

        // 3. Get all reviews for this sandwich
        const reviewsRef = collection(db, 'reviews');
        const q = query(reviewsRef, where('sandwichId', '==', sandwichId));
        const reviewsSnap = await getDocs(q);
        const reviews = reviewsSnap.docs
            .map(doc => doc.data().comment)
            .filter(comment => !!comment && comment.length > 5); // Only meaningful reviews

        if (reviews.length === 0) return;

        // 4. Generate new description
        const newDescription = await generateSandwichDescription(
            sandwichData.name,
            restaurantName,
            reviews
        );

        // 5. Update sandwich document
        if (newDescription) {
            await updateDoc(sandwichRef, {
                description: newDescription,
                descriptionUpdatedAt: serverTimestamp()
            });
        }
    } catch (error) {
        console.error('Error in updateSandwichDescription:', error);
    }
}

export async function getGlobalIngredients(): Promise<string[]> {
    const querySnapshot = await getDocs(collection(db, 'ingredients'));
    return querySnapshot.docs.map(doc => doc.data().name);
}
