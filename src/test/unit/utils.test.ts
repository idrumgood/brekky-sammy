import { describe, it, expect } from 'vitest';
import { cleanIngredient, getRatingLabel, mergeIngredients } from '@/lib/utils';

describe('utils.ts', () => {
    describe('cleanIngredient', () => {
        it('should lowercase and trim strings', () => {
            expect(cleanIngredient('  Bacon  ')).toBe('bacon');
            expect(cleanIngredient('Egg AND Cheese')).toBe('egg and cheese');
        });
    });

    describe('getRatingLabel', () => {
        it('should return correct labels for ratings', () => {
            expect(getRatingLabel(5)).toBe('Legendary');
            expect(getRatingLabel(3)).toBe('Solid');
            expect(getRatingLabel(1)).toBe('Never Again');
            expect(getRatingLabel(0)).toBe('Pick a star');
        });
    });

    describe('mergeIngredients', () => {
        it('should merge and de-duplicate ingredients', () => {
            const existing = ['bacon', 'egg'];
            const added = ['CHEESE', ' bacon ', ''];
            const result = mergeIngredients(existing, added);
            expect(result).toEqual(['bacon', 'egg', 'cheese']);
        });

        it('should handle empty input', () => {
            expect(mergeIngredients([], [])).toEqual([]);
        });
    });
});
