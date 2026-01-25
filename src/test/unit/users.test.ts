/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getUserProfile, updateUserProfile } from '@/lib/users';
import { getDoc, updateDoc } from 'firebase/firestore';

describe('users.ts profile management', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return null if user profile does not exist', async () => {
        (getDoc as any).mockResolvedValue({
            exists: () => false
        });

        const profile = await getUserProfile('non-existent');
        expect(profile).toBeNull();
    });

    it('should return user data if profile exists', async () => {
        const mockData = { displayName: 'John Doe', email: 'john@example.com' };
        (getDoc as any).mockResolvedValue({
            exists: () => true,
            data: () => mockData
        });

        const profile = await getUserProfile('user1');
        expect(profile).toEqual(mockData);
    });

    it('should update user profile and return true', async () => {
        (updateDoc as any).mockResolvedValue(true);

        const result = await updateUserProfile('user1', { bio: 'New bio' });
        expect(result).toBe(true);
        expect(updateDoc).toHaveBeenCalled();
    });
});
