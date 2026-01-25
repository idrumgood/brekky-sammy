import { db } from '../src/lib/firebase-admin';

async function removeStreakBadge() {
    console.log('--- Removing Streak Badge from all users ---');

    try {
        const usersSnap = await db.collection('users').get();

        for (const userDoc of usersSnap.docs) {
            const userData = userDoc.data();
            const currentBadges = userData.badges || [];

            if (currentBadges.includes('streak')) {
                const newBadges = currentBadges.filter((b: string) => b !== 'streak');
                await db.collection('users').doc(userDoc.id).update({
                    badges: newBadges
                });
                console.log(`Removed streak badge from user: ${userData.displayName || userDoc.id}`);
            }
        }

        console.log('--- Finished removing streak badge ---');
    } catch (error) {
        console.error('Error:', error);
    }
}

removeStreakBadge();
