import { Sandwich } from './sandwiches';
import { FilterState } from '@/components/FilterControls';
import { SortOption } from '@/components/SortControls';

const MEAT_KEYWORDS = ['bacon', 'sausage', 'ham', 'chorizo', 'steak', 'pork', 'chicken', 'turkey', 'prosciutto', 'salami', 'pepperoni'];
const ANIMAL_PRODUCT_KEYWORDS = [...MEAT_KEYWORDS, 'egg', 'cheese', 'butter', 'mayo', 'aioli', 'honey', 'cream', 'milk'];

const CATEGORY_MAP: Record<string, { keywords: string[], ingredients: string[] }> = {
    'Burrito': { keywords: ['burrito'], ingredients: ['tortilla'] },
    'Sandwich': { keywords: ['sandwich', 'muffin'], ingredients: ['bread', 'toast', 'sourdough', 'brioche', 'bun', 'english muffin'] },
    'Bagel': { keywords: ['bagel'], ingredients: ['bagel'] },
    'Biscuit': { keywords: ['biscuit'], ingredients: ['biscuit'] },
    'Taco': { keywords: ['taco'], ingredients: ['taco shell'] },
};

export function isVegetarian(sandwich: Sandwich): boolean {
    const ingredients = (sandwich.ingredients || []).map(i => i.toLowerCase());
    const name = sandwich.name.toLowerCase();
    
    const check = (text: string) => MEAT_KEYWORDS.some(meat => {
        const regex = new RegExp(`\\b${meat}\\b`, 'i');
        return regex.test(text);
    });

    const hasMeat = ingredients.some(check) || check(name);
    return !hasMeat;
}

export function isVegan(sandwich: Sandwich): boolean {
    const ingredients = (sandwich.ingredients || []).map(i => i.toLowerCase());
    const name = sandwich.name.toLowerCase();
    
    const check = (text: string) => ANIMAL_PRODUCT_KEYWORDS.some(ap => {
        const regex = new RegExp(`\\b${ap}\\b`, 'i');
        return regex.test(text);
    });

    const hasAnimalProducts = ingredients.some(check) || check(name);
    return !hasAnimalProducts;
}

export function getDerivedCategories(sandwich: Sandwich): string[] {
    const name = sandwich.name.toLowerCase();
    const ingredients = (sandwich.ingredients || []).map(i => i.toLowerCase());
    const categories: string[] = [];

    for (const [cat, rules] of Object.entries(CATEGORY_MAP)) {
        const matchesKeyword = rules.keywords.some(k => name.includes(k));
        const matchesIngredient = rules.ingredients.some(ri => ingredients.some(ing => ing.includes(ri)));
        if (matchesKeyword || matchesIngredient) {
            categories.push(cat);
        }
    }

    return categories;
}

export function filterAndSortSandwiches(
    sandwiches: Sandwich[],
    filters: FilterState,
    sort: SortOption,
    searchQuery: string = ''
): Sandwich[] {
    let results = [...sandwiches];

    // 1. Text Search (if provided)
    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        results = results.filter(s => 
            s.name.toLowerCase().includes(q) || 
            (s.ingredients || []).some(i => i.toLowerCase().includes(q))
        );
    }

    // 2. Dietary Filters
    if (filters.dietary?.includes('Vegetarian')) {
        results = results.filter(s => isVegetarian(s));
    }
    if (filters.dietary?.includes('Vegan')) {
        results = results.filter(s => isVegan(s));
    }

    // 3. Category Filters
    if (filters.categories && filters.categories.length > 0) {
        results = results.filter(s => {
            const cats = getDerivedCategories(s);
            return filters.categories.some(fc => cats.includes(fc));
        });
    }

    // 4. Must Include Ingredients
    if (filters.mustInclude && filters.mustInclude.length > 0) {
        results = results.filter(s => {
            const ingredients = (s.ingredients || []).map(i => i.toLowerCase());
            return filters.mustInclude.every(mi => 
                ingredients.some(ing => ing.includes(mi.toLowerCase()))
            );
        });
    }

    // 5. Sorting
    results.sort((a, b) => {
        if (sort === 'rating') {
            return (b.averageRating || 0) - (a.averageRating || 0);
        }
        if (sort === 'popularity') {
            return (b.reviewCount || 0) - (a.reviewCount || 0);
        }
        if (sort === 'recency') {
            const dateA = a.createdAt ? new Date(a.createdAt as any).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt as any).getTime() : 0;
            return dateB - dateA;
        }
        return 0;
    });

    return results;
}
