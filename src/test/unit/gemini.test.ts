import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateSandwichDescription } from '@/lib/gemini';

// Mock the GoogleGenerativeAI dependency
vi.mock('@google/generative-ai', () => {
    return {
        GoogleGenerativeAI: vi.fn().mockImplementation(function() {
            return {
                getGenerativeModel: vi.fn().mockImplementation(() => ({
                    generateContent: vi.fn().mockResolvedValue({
                        response: {
                            text: () => "This is a delicious breakfast sandwich blurb."
                        }
                    })
                }))
            };
        })
    };
});

describe('generateSandwichDescription', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Ensure process.env has a mock key for the function check
        process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY = 'mock-key';
    });

    it('should generate a description based on reviews', async () => {
        const description = await generateSandwichDescription(
            'The Classic',
            'Egg Slut',
            ['It was amazing', 'The yolk was perfect']
        );

        expect(description).toBe("This is a delicious breakfast sandwich blurb.");
    });

    it('should return an empty string if API key is missing', async () => {
        // Temporarily clear the key
        const originalKey = process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY;
        delete process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY;
        delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        const description = await generateSandwichDescription('Test', 'Test', []);
        expect(description).toBe("");

        process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY = originalKey;
    });
});
