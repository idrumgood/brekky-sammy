const admin = require('firebase-admin');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

if (!admin.apps.length) {
    admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
}

const db = admin.firestore();

const ingredients = [
    "Bacon",
    "Sausage",
    "Fried Egg",
    "Scrambled Egg",
    "Cheddar",
    "American Cheese",
    "Swiss",
    "Provolone",
    "Brioche Bun",
    "Everything Bagel",
    "Sourdough",
    "Croissant",
    "Hashbrown",
    "Avocado",
    "Arugula",
    "Tomato",
    "Hot Sauce",
    "Maple Syrup",
    "Chili Crunch",
    "Miso Mayo",
    "Truffle Oil",
    "Spicy Mayo"
];

async function seedIngredients() {
    console.log("Seeding ingredients...");
    const batch = db.batch();

    ingredients.forEach(ing => {
        const docRef = db.collection('ingredients').doc(ing.toLowerCase());
        batch.set(docRef, { name: ing.toLowerCase() }, { merge: true });
    });

    await batch.commit();
    console.log(`Successfully seeded ${ingredients.length} ingredients.`);
}

seedIngredients().catch(console.error);
