/**
 * Cleans an ingredient string by trimming and converting to lowercase.
 */
export function cleanIngredient(ingredient: string): string {
    return ingredient.toLowerCase().trim();
}

/**
 * Returns a human-readable label for a given rating.
 */
export function getRatingLabel(rating: number): string {
    switch (rating) {
        case 5: return 'Legendary';
        case 4: return 'Great';
        case 3: return 'Solid';
        case 2: return 'Meh';
        case 1: return 'Never Again';
        default: return 'Pick a star';
    }
}

/**
 * Merges two arrays of ingredients and returns a unique, cleaned list.
 */
export function mergeIngredients(existing: string[], added: string[]): string[] {
    const cleanedAdded = added.map(cleanIngredient).filter(Boolean);
    return Array.from(new Set([...existing, ...cleanedAdded]));
}

/**
 * Sanitizes an object by converting Firestore Timestamps to ISO strings.
 * This is recursive and handles arrays as well.
 * Necessary for serialization when passing data from Server to Client Components.
 */
export function sanitize(obj: any): any {
    if (obj === null || obj === undefined) return obj;

    // Handle Timestamps (both Admin and Client SDK formats)
    if (typeof obj === 'object') {
        if (typeof obj.toDate === 'function') {
            return obj.toDate().toISOString();
        }
        if (obj._seconds !== undefined) {
            return new Date(obj._seconds * 1000 + (obj._nanoseconds || 0) / 1000000).toISOString();
        }
    }

    // Handle Arrays
    if (Array.isArray(obj)) {
        return obj.map(item => sanitize(item));
    }

    // Handle Objects
    if (typeof obj === 'object' && obj.constructor === Object) {
        const newObj: any = {};
        for (const [key, value] of Object.entries(obj)) {
            newObj[key] = sanitize(value);
        }
        return newObj;
    }

    return obj;
}
