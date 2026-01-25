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

    it('should sanitize XSS payloads during update', async () => {
        (updateDoc as any).mockResolvedValue(true);

        await updateUserProfile('user1', {
            displayName: '<script>alert(1)</script>Name',
            location: '<b>Chicago</b>',
            bio: '<i>My bio</i> <img src=x onerror=alert(2)>'
        });

        expect(updateDoc).toHaveBeenCalledWith(
            expect.anything(),
            expect.objectContaining({
                displayName: 'Name',
                location: 'Chicago',
                bio: 'My bio'
            })
        );
    });

    it('should throw error on profile validation failure', async () => {
        const invalidData = {
            displayName: '', // Too short
            bio: 'a'.repeat(600) // Too long
        };

        await expect(updateUserProfile('user1', invalidData as any)).rejects.toThrow('Validation failed');
    });
});
