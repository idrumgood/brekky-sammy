import { db } from '../src/lib/firebase-admin';
import { calculateEligibleBadges } from '../src/lib/badges';

async function runRetroactiveBadges() {
    console.log('--- Starting Retroactive Badge Awarding ---');

    try {
        const usersSnap = await db.collection('users').get();
        console.log(`Found ${usersSnap.size} users.`);

        for (const userDoc of usersSnap.docs) {
            const userData = userDoc.data();
            const uid = userDoc.id;

            console.log(`Processing user: ${userData.displayName || uid}...`);

            // 1. Fetch user reviews
            const reviewsSnap = await db.collection('reviews').where('userId', '==', uid).get();
            const reviews = reviewsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // 2. Calculate eligible badges
            const eligibleBadges = await calculateEligibleBadges(uid, reviews, userData);

            console.log(`  Eligible badges: ${eligibleBadges.join(', ') || 'None'}`);

            // 3. Update user profile
            await db.collection('users').doc(uid).update({
                badges: eligibleBadges,
                lastUpdated: new Date()
            });

            console.log(`  Updated user profile with ${eligibleBadges.length} badges.`);
        }

        console.log('--- Finished Retroactive Badge Awarding ---');
    } catch (error) {
        console.error('Error during retroactive badge check:', error);
    }
}

runRetroactiveBadges();
