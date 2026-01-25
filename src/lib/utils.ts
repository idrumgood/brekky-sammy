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
