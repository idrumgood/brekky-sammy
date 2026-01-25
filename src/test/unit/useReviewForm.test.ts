import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useReviewForm } from '@/hooks/useReviewForm';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { getDocs, query, collection, orderBy } from 'firebase/firestore';

// Mock dependencies
vi.mock('@/lib/AuthContext', () => ({
    useAuth: vi.fn(),
}));

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

vi.mock('@/lib/reviews', () => ({
    createReview: vi.fn(),
    getGlobalIngredients: vi.fn().mockResolvedValue(['bacon', 'egg', 'cheese']),
}));

describe('useReviewForm hook', () => {
    const mockPush = vi.fn();
    const mockUser = { uid: '123', displayName: 'Test User' };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as any).mockReturnValue({ user: mockUser });
        (useRouter as any).mockReturnValue({ push: mockPush });
    });

    it('should initialize with correct default state', () => {
        const { result } = renderHook(() => useReviewForm());
        expect(result.current.step).toBe(1);
        expect(result.current.loading).toBe(false);
        expect(result.current.selectedIngredients).toEqual([]);
    });

    it('should transition between steps and keep state', () => {
        const { result } = renderHook(() => useReviewForm());

        act(() => {
            result.current.setSelectedRestaurantId('rest1');
            result.current.setStep(2);
        });

        expect(result.current.step).toBe(2);
        expect(result.current.selectedRestaurantId).toBe('rest1');
    });

    it('should handle ingredient additions and removals', () => {
        const { result } = renderHook(() => useReviewForm());

        act(() => {
            result.current.addIngredient(' Bacon ');
        });
        expect(result.current.selectedIngredients).toContain('bacon');

        act(() => {
            result.current.removeIngredient('bacon');
        });
        expect(result.current.selectedIngredients).not.toContain('bacon');
    });

    it('should navigate back to step 1 from step 2', () => {
        const { result } = renderHook(() => useReviewForm());

        act(() => {
            result.current.setStep(2);
        });
        expect(result.current.step).toBe(2);

        act(() => {
            result.current.setStep(1);
        });
        expect(result.current.step).toBe(1);
    });
});
