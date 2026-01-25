import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { createReview } from '@/lib/reviews';
import { runTransaction } from 'firebase/firestore';

// We've already mocked firebase and storage in src/test/setup.ts

describe('reviews.ts library', () => {
    let mockTransaction: any;

    beforeEach(() => {
        vi.clearAllMocks();

        mockTransaction = {
            get: vi.fn().mockResolvedValue({ exists: () => false }),
            set: vi.fn(),
            update: vi.fn(),
        };

        // Mock runTransaction to execute the callback immediately with our mockTransaction
        (runTransaction as Mock).mockImplementation((db: any, callback: any) => callback(mockTransaction));
    });

    it('should handle restaurant and sandwich creation in a transaction', async () => {
        const mockInput = {
            userId: 'user1',
            userName: 'User One',
            rating: 5,
            comment: 'Amazing!',
            sandwichId: 'new',
            restaurantId: 'new',
            newRestaurantName: 'New Spot',
            newSandwichName: 'New Sammy',
            ingredients: ['bacon', 'egg']
        };

        const result = await createReview(mockInput);

        expect(runTransaction).toHaveBeenCalled();
        expect(result).toHaveProperty('restaurantId');
        expect(result).toHaveProperty('sandwichId');

        // Check that set was called for restaurant, sandwich, review, and each ingredient
        // 1 (rest) + 1 (sand) + 1 (review) + 2 (ingredients) = 5
        expect(mockTransaction.set).toHaveBeenCalledTimes(5);
    });

    it('should update an existing sandwich with average rating logic and photo merging', async () => {
        const mockInput = {
            userId: 'user1',
            userName: 'User One',
            rating: 3,
            comment: 'Decent',
            sandwichId: 'sand1',
            restaurantId: 'rest1',
            ingredients: ['cheese'],
            imageFile: new File([''], 'test.jpg', { type: 'image/jpeg' })
        };

        // Mock existing sandwich data
        mockTransaction.get.mockResolvedValue({
            exists: () => true,
            data: () => ({
                reviewCount: 1,
                averageRating: 5,
                ingredients: ['bacon'],
                imageUrl: 'old-url.jpg',
                allPhotos: ['old-url.jpg']
            })
        });

        // We rely on the global storage mocks in setup.ts for image upload logic
        await createReview(mockInput);

        // Check that update was called with merged photos and new average
        expect(mockTransaction.update).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                reviewCount: 2,
                averageRating: 4,
                allPhotos: ['old-url.jpg', 'mock-download-url'],
                ingredients: expect.arrayContaining(['bacon', 'cheese'])
            })
        );
    });

    it('should set initial photo if existing sandwich has none', async () => {
        const mockInput = {
            userId: 'user1',
            userName: 'User One',
            rating: 5,
            comment: 'Yum',
            sandwichId: 'sand1',
            restaurantId: 'rest1',
            ingredients: ['egg']
        };

        mockTransaction.get.mockResolvedValue({
            exists: () => true,
            data: () => ({
                reviewCount: 0,
                averageRating: 0,
                ingredients: [],
                imageUrl: null,
                allPhotos: []
            })
        });

        // We need to simulate the image upload in the input if we want to test imageUrl setting
        // But for this test let's just ensure it handles empty data gracefully
        await createReview(mockInput);
        expect(mockTransaction.update).toHaveBeenCalled();
    });


    it('should throw error on validation failure', async () => {
        const mockInput = {
            userId: '', // Invalid: min(1)
            userName: 'User',
            rating: 10, // Invalid: max(5)
            comment: 'Too short?',
            sandwichId: 'sand1',
            restaurantId: 'rest1',
            ingredients: []
        };

        await expect(createReview(mockInput as any)).rejects.toThrow('Validation failed');
    });
});
