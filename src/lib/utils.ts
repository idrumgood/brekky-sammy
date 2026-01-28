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
 * This is necessary for serialization when passing data from Server to Client Components.
 */
export function sanitize(obj: any): any {
    if (!obj) return null;
    const newObj = { ...obj };
    for (const [key, value] of Object.entries(newObj)) {
        if (value && typeof value === 'object') {
            if ('toDate' in (value as any)) {
                newObj[key] = (value as any).toDate().toISOString();
            } else if ('_seconds' in (value as any)) {
                newObj[key] = new Date((value as any)._seconds * 1000).toISOString();
            }
        }
    }
    return newObj;
}
