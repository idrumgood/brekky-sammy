import * as admin from 'firebase-admin';

const firebaseProjectConfig = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

if (!admin.apps.length) {
    admin.initializeApp(firebaseProjectConfig);
}

const db = admin.firestore();

export { db };
