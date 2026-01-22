const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

/**
 * Migration Script for BrekkySammy (Refined)
 * This script runs in a Node environment (WSL).
 * It reads CSV files from /old-data and prepares them for Firestore.
 */

const DATA_DIR = path.join(__dirname, '../old-data');

const INGREDIENTS_KEYWORDS = [
    'egg', 'bacon', 'sausage', 'hashbrown', 'hash brown', 'cheese', 'cheddar', 'american cheese', 'provolone', 'swiss',
    'muffin', 'english muffin', 'biscuit', 'croissant', 'sourdough', 'potato bun', 'brioche',
    'jalapeno', 'jalapeño', 'jam', 'aioli', 'mayo', 'kale', 'mushroom', 'sweet potato', 'pork', 'latke'
];

const NON_SANDWICH_REGEX = /(?:,\s*)?(?:espresso|drip coffee|cortado|cappucino|latte|beer|coffee|cherry bay bomb|poptart|pastries|cider muffin|drip)/gi;

function parseRating(starString) {
    if (!starString) return 0;
    const stars = (starString.match(/🌟/g) || []).length;
    return stars;
}

function cleanSandwichName(name) {
    // 1. Remove parenthetical expressions containing non-sandwich keywords
    let cleaned = name.replace(/\([^)]*(?:drink|coffee|espresso|latte|milk)[^)]*\)/gi, '').trim();

    // 2. Remove segments after commas/and if they are mostly non-sandwich items
    const segments = cleaned.split(/,|\s+&\s+|\s+and\s+/i);
    if (segments.length > 1) {
        // Keep only segments that don't match the non-sandwich regex
        const filtered = segments.filter(seg => !seg.match(NON_SANDWICH_REGEX)).map(s => s.trim()).filter(Boolean);
        if (filtered.length > 0) {
            cleaned = filtered.join(', ');
        }
    }

    // 3. Final regex sweep for individual terms
    cleaned = cleaned.replace(NON_SANDWICH_REGEX, '').trim();

    // 4. Cleanup trailing punctuation and conjunctions
    cleaned = cleaned.replace(/^[,\s&.\/]+|[,\s&.\/]+$/g, '').trim();

    // Capitalize
    if (cleaned.length > 0) {
        cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    return cleaned || "Breakfast Sandwich";
}

function extractIngredients(name, comment) {
    const text = `${name} ${comment}`.toLowerCase();
    const found = new Set();

    INGREDIENTS_KEYWORDS.forEach(keyword => {
        if (text.includes(keyword)) {
            // Normalize "hash brown" / "hashbrown"
            if (keyword === 'hash brown') found.add('hashbrown');
            else if (keyword === 'jalapeño') found.add('jalapeno');
            else found.add(keyword);
        }
    });

    return Array.from(found);
}

async function migrate() {
    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.csv'));

    const restaurants = [];
    const sandwiches = [];
    const reviews = [];

    for (const file of files) {
        const filePath = path.join(DATA_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');

        // The CSVs have a non-standard header structure based on the Allez Café example
        const lines = content.split('\n');
        const restaurantName = lines[1].split(',')[2]?.trim();
        const website = lines[2].split(',').pop()?.trim();

        if (!restaurantName) continue;

        const restaurantId = restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        restaurants.push({
            id: restaurantId,
            name: restaurantName,
            website: website || '',
            location: 'Chicago, IL',
        });

        // Parse the actual review rows
        const reviewRows = parse(lines.slice(3).join('\n'), {
            columns: true,
            skip_empty_lines: true,
        });

        for (const row of reviewRows) {
            if (!row.Order || !row.Rating) continue;

            const rawSandwichName = row.Order.trim();
            const sandwichName = cleanSandwichName(rawSandwichName);
            const sandwichId = `${restaurantId}-${sandwichName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

            // Add sandwich if not already present
            let sandwich = sandwiches.find(s => s.id === sandwichId);
            if (!sandwich) {
                sandwich = {
                    id: sandwichId,
                    name: sandwichName,
                    restaurantId: restaurantId,
                    averageRating: 0,
                    reviewCount: 0,
                    ingredients: [],
                };
                sandwiches.push(sandwich);
            }

            // Extract ingredients and merge
            const ingredients = extractIngredients(rawSandwichName, row.Comments || "");
            sandwich.ingredients = Array.from(new Set([...sandwich.ingredients, ...ingredients]));

            reviews.push({
                sandwichId: sandwichId,
                userName: row.Diner,
                rating: parseRating(row.Rating),
                comment: row.Comments,
                createdAt: new Date().toISOString(),
            });
        }
    }

    // Calculate averages for sandwiches
    sandwiches.forEach(s => {
        const sReviews = reviews.filter(r => r.sandwichId === s.id);
        s.reviewCount = sReviews.length;
        s.averageRating = sReviews.reduce((acc, r) => acc + r.rating, 0) / s.reviewCount;
    });

    console.log('--- Refined Migration Data Prepared ---');
    console.log(`Restaurants: ${restaurants.length}`);
    console.log(`Sandwiches: ${sandwiches.length}`);
    console.log(`Reviews: ${reviews.length}`);

    fs.writeFileSync(path.join(__dirname, 'migration_payload.json'), JSON.stringify({
        restaurants,
        sandwiches,
        reviews
    }, null, 2));
}

migrate().catch(console.error);
