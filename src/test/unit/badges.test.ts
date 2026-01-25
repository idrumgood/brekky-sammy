import { describe, it, expect } from 'vitest';
import { calculateEligibleBadges } from '@/lib/badges';

describe('badges.ts awarding logic', () => {
    const mockUid = 'user123';
    const mockProfile = { displayName: 'Test User' };

    it('should award First Bite on the first review', async () => {
        const reviews = [{ id: 'rev1', createdAt: new Date().toISOString() }];
        const badges = await calculateEligibleBadges(mockUid, reviews, mockProfile);
        expect(badges).toContain('first_review');
        expect(badges).not.toContain('founder'); // Not auto-awarded anymore
    });

    it('should preserve Founder status if user already has it', async () => {
        const reviews = [{ id: 'rev1', createdAt: new Date().toISOString() }];
        const profileWithFounder = { ...mockProfile, badges: ['founder'] };
        const badges = await calculateEligibleBadges(mockUid, reviews, profileWithFounder);
        expect(badges).toContain('founder');
    });

    it('should award High Five on 5 reviews', async () => {
        const reviews = Array(5).fill(0).map((_, i) => ({ id: `rev${i}`, createdAt: new Date().toISOString() }));
        const badges = await calculateEligibleBadges(mockUid, reviews, mockProfile);
        expect(badges).toContain('five_reviews');
        expect(badges).not.toContain('ten_reviews');
    });

    it('should award Over Easy for the correct ingredient', async () => {
        const reviews = [{
            id: 'rev1',
            ingredients: ['over-easy egg', 'bacon'],
            createdAt: new Date().toISOString()
        }];
        const badges = await calculateEligibleBadges(mockUid, reviews, mockProfile);
        expect(badges).toContain('egg_over_easy');
    });

    it('should award Cheese Head for 3 different cheeses', async () => {
        const reviews = [{
            id: 'rev1',
            ingredients: ['cheddar', 'swiss', 'provolone'],
            createdAt: new Date().toISOString()
        }];
        const badges = await calculateEligibleBadges(mockUid, reviews, mockProfile);
        expect(badges).toContain('cheese_variety');
    });

    it('should award Early Bird for reviews before 8 AM', async () => {
        const earlyDate = new Date();
        earlyDate.setHours(7, 0, 0);
        const reviews = [{ id: 'rev1', createdAt: earlyDate.toISOString() }];
        const badges = await calculateEligibleBadges(mockUid, reviews, mockProfile);
        expect(badges).toContain('early_bird');
    });

    it('should award streak for 3 reviews in 7 days', async () => {
        const now = Date.now();
        const reviews = [
            { id: 'rev1', createdAt: new Date(now).toISOString() },
            { id: 'rev2', createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'rev3', createdAt: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString() },
        ];
        const badges = await calculateEligibleBadges(mockUid, reviews, mockProfile);
        expect(badges).toContain('streak');
    });

    it('should award veggie for a sandwich with no meat and many ingredients', async () => {
        const reviews = [{
            id: 'rev1',
            ingredients: ['kale', 'sprouts', 'spinach', 'avocado', 'egg'],
            createdAt: new Date().toISOString()
        }];
        const badges = await calculateEligibleBadges(mockUid, reviews, mockProfile);
        expect(badges).toContain('veggie');
    });

    it('should preserve Pioneer and Mastermind badges if already earned', async () => {
        const reviews: any[] = []; // No reviews
        const profile = { ...mockProfile, badges: ['first_restaurant', 'first_sandwich'] };
        const badges = await calculateEligibleBadges(mockUid, reviews, profile);
        expect(badges).toContain('first_restaurant');
        expect(badges).toContain('first_sandwich');
    });
});
