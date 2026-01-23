require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

/**
 * Script to attribute specific reviews to a User ID.
 * Usage: node scripts/attribute-reviews.js
 */

if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.error('Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID not found in .env.local');
    process.exit(1);
}

if (!admin.apps.length) {
    admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
}

const db = admin.firestore();

const BRYAN_UID = 'DLAUCEBsgFXWOJ5TtBce4GOz2qP2';

async function updateReviews() {
    console.log(`Searching for reviews by "Bryan"...`);

    const reviewsSnap = await db.collection('reviews')
        .where('userName', '==', 'Bryan')
        .get();

    if (reviewsSnap.empty) {
        console.log('No reviews found for "Bryan".');
        return;
    }

    console.log(`Found ${reviewsSnap.size} reviews. Updating...`);

    const batch = db.batch();

    reviewsSnap.docs.forEach(doc => {
        batch.update(doc.ref, { userId: BRYAN_UID });
    });

    await batch.commit();
    console.log(`Successfully attributed ${reviewsSnap.size} reviews to UID: ${BRYAN_UID}`);
}

updateReviews().catch(console.error);
