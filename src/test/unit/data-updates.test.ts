import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateRestaurant } from '@/lib/restaurants';
import { updateSandwich } from '@/lib/sandwiches';
import { updateDoc } from 'firebase/firestore';

describe('data updates (restaurants & sandwiches)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should update restaurant with a new timestamp', async () => {
        await updateRestaurant('rest1', { name: 'Updated Name' });

        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                name: 'Updated Name',
                updatedAt: expect.any(String)
            })
        );
    });

    it('should update sandwich with correct fields', async () => {
        await updateSandwich('sand1', { reviewCount: 10 });

        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                reviewCount: 10,
                updatedAt: expect.any(String)
            })
        );
    });
});
