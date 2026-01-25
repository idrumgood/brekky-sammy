import { z } from 'zod';

export const ReviewSchema = z.object({
    userId: z.string().min(1, 'User ID is required'),
    userName: z.string().min(1, 'User name is required').max(100),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1000, 'Comment is too long'),
    sandwichId: z.string().min(1, 'Sandwich selection is required'),
    restaurantId: z.string().min(1, 'Restaurant selection is required'),
    ingredients: z.array(z.string()).max(20, 'Too many ingredients'),
    newRestaurantName: z.string().max(100).optional(),
    newRestaurantWebsite: z.url({ message: 'Invalid website URL' }).or(z.literal('')).optional(),
    newSandwichName: z.string().max(100).optional(),
    imageFile: z.instanceof(File).optional(),
});

export type ReviewInput = z.infer<typeof ReviewSchema>;

export const RestaurantSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    website: z.url({ message: 'Invalid website URL' }).or(z.literal('')).optional(),
    location: z.string().default('Chicago, IL'),
});

export const SandwichSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    restaurantId: z.string().min(1, 'Restaurant ID is required'),
    ingredients: z.array(z.string()).max(20),
});

export const UserProfileSchema = z.object({
    displayName: z.string().min(1, 'Display name is required').max(100),
    location: z.string().max(100).optional(),
    bio: z.string().max(500, 'Bio is too long').optional(),
    photoURL: z.url().or(z.literal('')).optional(),
});

export type UserProfileInput = z.infer<typeof UserProfileSchema>;
