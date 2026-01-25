import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc, setDoc, doc } from 'firebase/firestore';

// Helper component to test useAuth
const TestConsumer = () => {
    const { user, loading, isAdmin } = useAuth();
    if (loading) return <div>Loading...</div>;
    return (
        <div>
            <span data-testid="user">{user?.email || 'no-user'}</span>
            <span data-testid="admin">{isAdmin ? 'admin' : 'member'}</span>
        </div>
    );
};

describe('AuthContext sync and role logic', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should sync user data and fetch admin role on auth state change', async () => {
        const mockUser = { uid: '123', email: 'admin@test.com', displayName: 'Admin' };

        // Mock onAuthStateChanged to trigger immediately
        (onAuthStateChanged as any).mockImplementation((auth: any, callback: any) => {
            callback(mockUser);
            return vi.fn(); // unsubscribe
        });

        // Mock Firestore responses
        (doc as any).mockReturnValue('user-ref');
        (getDoc as any).mockResolvedValue({
            exists: () => true,
            data: () => ({ role: 'admin' })
        });

        const { getByTestId } = render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(getByTestId('user').textContent).toBe('admin@test.com');
            expect(getByTestId('admin').textContent).toBe('admin');
        });

        expect(setDoc).toHaveBeenCalledWith('user-ref', expect.objectContaining({
            uid: '123',
            email: 'admin@test.com'
        }), { merge: true });
    });

    it('should handle non-admin users correctly', async () => {
        const mockUser = { uid: '456', email: 'user@test.com' };

        (onAuthStateChanged as any).mockImplementation((auth: any, callback: any) => {
            callback(mockUser);
            return vi.fn();
        });

        (getDoc as any).mockResolvedValue({
            exists: () => true,
            data: () => ({ role: 'member' })
        });

        const { getByTestId } = render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(getByTestId('admin').textContent).toBe('member');
        });
    });
});
