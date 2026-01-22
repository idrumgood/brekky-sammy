require('dotenv').config({ path: '.env.local' });
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const fs = require('fs');
const path = require('path');

/**
 * Seed Script for BrekkySammy
 * This script takes the migration_payload.json and pushes it to Firestore.
 */

// Since we are running locally with gcloud logged in, we can use application default credentials
// or initialize with just the project ID if the environment is set up.
// Better yet, for simplicity in WSL, we'll use the environment variables.

const admin = require('firebase-admin');

if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.error('Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID not found in .env.local');
    process.exit(1);
}

admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

const db = getFirestore();

async function seed() {
    const payloadPath = path.join(__dirname, 'migration_payload.json');
    if (!fs.existsSync(payloadPath)) {
        console.error('Error: migration_payload.json not found. Run prepare-migration.js first.');
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));

    console.log('Seeding Restaurants...');
    for (const restaurant of data.restaurants) {
        const { id, ...rest } = restaurant;
        await db.collection('restaurants').doc(id).set(rest);
        console.log(`  Added: ${restaurant.name}`);
    }

    console.log('Seeding Sandwiches...');
    for (const sandwich of data.sandwiches) {
        const { id, ...rest } = sandwich;
        await db.collection('sandwiches').doc(id).set(rest);
        console.log(`  Added: ${sandwich.name}`);
    }

    console.log('Seeding Reviews...');
    for (const review of data.reviews) {
        // Reviews don't have IDs in the payload, let Firestore generate them
        await db.collection('reviews').add(review);
    }
    console.log(`  Added ${data.reviews.length} reviews.`);

    console.log('--- Seeding Complete! ---');
}

seed().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
