import { db } from './firebase';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

export interface Badge {
    slug: string;
    name: string;
    description: string;
    iconPath: string;
}

export const ALL_BADGES: Badge[] = [
    { slug: 'first_review', name: 'First Bite', description: 'Posted your first review!', iconPath: '/assets/badges/first_review.png' },
    { slug: 'five_reviews', name: 'High Five', description: 'Posted 5 reviews!', iconPath: '/assets/badges/five_reviews.png' },
    { slug: 'ten_reviews', name: 'Decathlete', description: 'Posted 10 reviews!', iconPath: '/assets/badges/ten_reviews.png' },
    { slug: 'twenty_reviews', name: 'Twenty Piece', description: 'Posted 20 reviews!', iconPath: '/assets/badges/twenty_reviews.png' },
    { slug: 'fifty_reviews', name: 'Sammy Sage', description: 'Posted 50 reviews!', iconPath: '/assets/badges/fifty_reviews.png' },
    { slug: 'founder', name: 'Founder', description: 'A pioneer of the Brekky Sammy club.', iconPath: '/assets/badges/founder.png' },
    { slug: 'first_restaurant', name: 'Pioneer', description: 'Added the first new restaurant!', iconPath: '/assets/badges/first_restaurant.png' },
    { slug: 'first_sandwich', name: 'Mastermind', description: 'Added the first new sandwich!', iconPath: '/assets/badges/first_sandwich.png' },
    { slug: 'egg_over_easy', name: 'Over Easy', description: 'Tried an over-easy egg.', iconPath: '/assets/badges/egg_over_easy.png' },
    { slug: 'egg_scrambled', name: 'Scrambled', description: 'Tried scrambled eggs.', iconPath: '/assets/badges/egg_scrambled.png' },
    { slug: 'egg_poached', name: 'Poached Pro', description: 'Tried a poached egg.', iconPath: '/assets/badges/egg_poached.png' },
    { slug: 'cheese_variety', name: 'Cheese Head', description: 'Tried 3 different cheese types.', iconPath: '/assets/badges/cheese_variety.png' },
    { slug: 'early_bird', name: 'Early Bird', description: 'Review posted before 8:00 AM.', iconPath: '/assets/badges/early_bird.png' },
    { slug: 'night_owl', name: 'Night Owl', description: 'Review posted after 10:00 PM.', iconPath: '/assets/badges/night_owl.png' },
    { slug: 'weekend_warrior', name: 'Weekend Warrior', description: '3 reviews posted on weekends.', iconPath: '/assets/badges/weekend_warrior.png' },
    { slug: 'spicy', name: 'Spicy Scout', description: 'Tried a sandwich with some heat.', iconPath: '/assets/badges/spicy.png' },
    { slug: 'avocado', name: 'Avocado Addict', description: '3 reviews with avocado.', iconPath: '/assets/badges/avocado.png' },
    { slug: 'bacon', name: 'Bacon Believer', description: '5 reviews with bacon.', iconPath: '/assets/badges/bacon.png' },
    { slug: 'veggie', name: 'Greens Grader', description: 'Tried a veggie-heavy sandwich.', iconPath: '/assets/badges/veggie.png' },
    { slug: 'streak', name: 'Consistent Gourmet', description: '3 reviews in one week.', iconPath: '/assets/badges/streak.png' },
];

/**
 * Checks which badges a user is eligible for based on their reviews and profile.
 */
export async function calculateEligibleBadges(uid: string, userReviews: any[], userProfile: any): Promise<string[]> {
    const earned: string[] = [];

    // 1. Review Counts
    if (userReviews.length >= 1) earned.push('first_review');
    if (userReviews.length >= 5) earned.push('five_reviews');
    if (userReviews.length >= 10) earned.push('ten_reviews');
    if (userReviews.length >= 20) earned.push('twenty_reviews');
    if (userReviews.length >= 50) earned.push('fifty_reviews');

    // 2. Founder (Preserve if already exists, don't auto-award to new users)
    if (userProfile?.badges?.includes('founder')) {
        earned.push('founder');
    }

    // 3. Pioneer / Mastermind (New entries - also sticky)
    if (userProfile?.badges?.includes('first_restaurant')) {
        earned.push('first_restaurant');
    }
    if (userProfile?.badges?.includes('first_sandwich')) {
        earned.push('first_sandwich');
    }

    // 4. Ingredient Milestones
    const allIngredients = userReviews.flatMap(r => r.ingredients || []).map((i: string) => i.toLowerCase());

    if (allIngredients.includes('over-easy egg')) earned.push('egg_over_easy');
    if (allIngredients.includes('scrambled egg') || allIngredients.includes('scrambled eggs')) earned.push('egg_scrambled');
    if (allIngredients.includes('poached egg')) earned.push('egg_poached');

    // Cheese variety (track unique cheeses)
    const cheeseTypes = ['cheddar', 'swiss', 'provolone', 'american', 'pepper jack', 'gruyere', 'blue cheese']
        .filter((c: string) => allIngredients.some((i: string) => i.includes(c)));
    if (cheeseTypes.length >= 3) earned.push('cheese_variety');

    // 5. Time-based
    const hours = userReviews.map((r: any) => new Date(r.createdAt).getHours());
    if (hours.some((h: number) => h < 8)) earned.push('early_bird');
    if (hours.some((h: number) => h >= 22)) earned.push('night_owl');

    // Weekend Warrior (Sat/Sun)
    const weekendReviews = userReviews.filter((r: any) => {
        const day = new Date(r.createdAt).getDay();
        return day === 0 || day === 6;
    });
    if (weekendReviews.length >= 3) earned.push('weekend_warrior');

    // 6. Specific Ingredients
    if (userReviews.some((r: any) => (r.ingredients || []).some((i: string) => i.toLowerCase().includes('spicy') || i.toLowerCase().includes('jalapeño') || i.toLowerCase().includes('hot sauce')))) {
        earned.push('spicy');
    }

    const avocadoCount = userReviews.filter((r: any) => (r.ingredients || []).some((i: string) => i.toLowerCase().includes('avocado'))).length;
    if (avocadoCount >= 3) earned.push('avocado');

    const baconCount = userReviews.filter((r: any) => (r.ingredients || []).some((i: string) => i.toLowerCase().includes('bacon'))).length;
    if (baconCount >= 5) earned.push('bacon');

    // Veggie (Check if no meat)
    const meatTerms = ['bacon', 'sausage', 'ham', 'chorizo', 'steak', 'pork', 'chicken'];
    const hasVeggieOnly = userReviews.some((r: any) => {
        const ingredients = (r.ingredients || []).map((i: string) => i.toLowerCase());
        return ingredients.length > 3 && !ingredients.some((i: string) => meatTerms.some((meat: string) => i.includes(meat)));
    });
    if (hasVeggieOnly) earned.push('veggie');

    // 7. Streak (3 in a week)
    // Simple check: any 3 reviews within a 7 day period
    const sortedDates = userReviews.map((r: any) => new Date(r.createdAt).getTime()).sort((a: number, b: number) => a - b);
    for (let i = 0; i <= sortedDates.length - 3; i++) {
        if (sortedDates[i + 2] - sortedDates[i] <= 7 * 24 * 60 * 60 * 1000) {
            earned.push('streak');
            break;
        }
    }

    return earned;
}

/**
 * Higher-level function to check and update badges for a user.
 * Typically called after a review is submitted.
 */
export async function updateUserBadges(uid: string, newAchievements: string[] = []) {
    try {
        // 1. Fetch user data
        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;
        const userData = userSnap.data();

        // 2. Fetch all user reviews
        const reviewsQuery = query(collection(db, 'reviews'), where('userId', '==', uid));
        const reviewsSnap = await getDocs(reviewsQuery);
        const reviews = reviewsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 3. Calculate badges
        let earned = await calculateEligibleBadges(uid, reviews, userData);

        // 4. Merge any instant achievements (e.g. from current review creation)
        if (newAchievements.length > 0) {
            earned = Array.from(new Set([...earned, ...newAchievements]));
        }

        // 5. Update profile (only if badges changed)
        const currentBadges = userData.badges || [];
        if (JSON.stringify(currentBadges.sort()) !== JSON.stringify(earned.sort())) {
            await updateDoc(userRef, {
                badges: earned,
                lastUpdated: new Date()
            });
            return earned;
        }
        return currentBadges;
    } catch (error) {
        console.error('Error updating user badges:', error);
    }
}
