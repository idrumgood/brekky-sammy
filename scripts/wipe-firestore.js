require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    console.error('Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID not found in .env.local');
    process.exit(1);
}

admin.initializeApp({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});

const db = getFirestore();

async function deleteCollection(collectionPath, batchSize = 100) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        resolve();
        return;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}

async function wipe() {
    console.log('Wiping collections...');
    await deleteCollection('restaurants');
    console.log('  Wiped: restaurants');
    await deleteCollection('sandwiches');
    console.log('  Wiped: sandwiches');
    await deleteCollection('reviews');
    console.log('  Wiped: reviews');
    console.log('--- Wipe Complete! ---');
}

wipe().catch(err => {
    console.error('Wipe failed:', err);
    process.exit(1);
});
