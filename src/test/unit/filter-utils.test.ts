import { describe, it, expect } from 'vitest';
import { filterAndSortSandwiches, isVegetarian, isVegan, getDerivedCategories } from '@/lib/filter-utils';
import { Sandwich } from '@/lib/sandwiches';

const MOCK_SANDWICHES: Sandwich[] = [
    {
        id: '1',
        name: 'Bacon Egg & Cheese',
        restaurantId: 'r1',
        averageRating: 4.5,
        reviewCount: 10,
        ingredients: ['Bacon', 'Egg', 'Cheese', 'Bread'],
        createdAt: '2023-01-01T10:00:00Z'
    },
    {
        id: '2',
        name: 'Veggie Burrito',
        restaurantId: 'r2',
        averageRating: 4.0,
        reviewCount: 5,
        ingredients: ['Avocado', 'Black Beans', 'Tortilla', 'Salsa'],
        createdAt: '2023-01-02T10:00:00Z'
    },
    {
        id: '3',
        name: 'Vegan Bagel',
        restaurantId: 'r3',
        averageRating: 3.5,
        reviewCount: 20,
        ingredients: ['Tofu Scramble', 'Bagel', 'Tomato'],
        createdAt: '2023-01-03T10:00:00Z'
    }
];

describe('filter-utils.ts', () => {
    describe('isVegetarian', () => {
        it('should identify vegetarian sandwiches', () => {
            expect(isVegetarian(MOCK_SANDWICHES[0])).toBe(false); // Bacon
            expect(isVegetarian(MOCK_SANDWICHES[1])).toBe(true);
            expect(isVegetarian(MOCK_SANDWICHES[2])).toBe(true);
        });
    });

    describe('isVegan', () => {
        it('should identify vegan sandwiches', () => {
            expect(isVegan(MOCK_SANDWICHES[0])).toBe(false); // Egg, Cheese
            expect(isVegan(MOCK_SANDWICHES[1])).toBe(true);
            expect(isVegan(MOCK_SANDWICHES[2])).toBe(true);
        });
    });

    describe('getDerivedCategories', () => {
        it('should derive correct categories', () => {
            expect(getDerivedCategories(MOCK_SANDWICHES[0])).toContain('Sandwich');
            expect(getDerivedCategories(MOCK_SANDWICHES[1])).toContain('Burrito');
            expect(getDerivedCategories(MOCK_SANDWICHES[2])).toContain('Bagel');
        });
    });

    describe('filterAndSortSandwiches', () => {
        it('should filter by dietary: Vegetarian', () => {
            const results = filterAndSortSandwiches(MOCK_SANDWICHES, { dietary: ['Vegetarian'], categories: [], mustInclude: [] }, 'rating');
            expect(results.length).toBe(2);
            expect(results.map(s => s.id)).not.toContain('1');
        });

        it('should filter by category: Burrito', () => {
            const results = filterAndSortSandwiches(MOCK_SANDWICHES, { dietary: [], categories: ['Burrito'], mustInclude: [] }, 'rating');
            expect(results.length).toBe(1);
            expect(results[0].id).toBe('2');
        });

        it('should sort by rating', () => {
            const results = filterAndSortSandwiches(MOCK_SANDWICHES, { dietary: [], categories: [], mustInclude: [] }, 'rating');
            expect(results[0].id).toBe('1'); // 4.5
            expect(results[1].id).toBe('2'); // 4.0
            expect(results[2].id).toBe('3'); // 3.5
        });

        it('should sort by popularity', () => {
            const results = filterAndSortSandwiches(MOCK_SANDWICHES, { dietary: [], categories: [], mustInclude: [] }, 'popularity');
            expect(results[0].id).toBe('3'); // 20 reviews
            expect(results[1].id).toBe('1'); // 10 reviews
            expect(results[2].id).toBe('2'); // 5 reviews
        });

        it('should filter by mustInclude: Avocado', () => {
            const results = filterAndSortSandwiches(MOCK_SANDWICHES, { dietary: [], categories: [], mustInclude: ['Avocado'] }, 'rating');
            expect(results.length).toBe(1);
            expect(results[0].id).toBe('2');
        });
    });
});
