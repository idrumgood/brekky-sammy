import { GoogleGenerativeAI } from "@google/generative-ai";

const getApiKey = () => process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";

export async function generateSandwichDescription(
    sandwichName: string,
    restaurantName: string,
    reviews: string[]
): Promise<string> {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.warn("Gemini API key is missing. Skipping description generation.");
        return "";
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

    const prompt = `
You are the world's most passionate breakfast sandwich enthusiast. 
Your mission is to write a clever, engaging, and mouth-watering summary 
(the "Sammy Detail") for a sandwich called "${sandwichName}" from "${restaurantName}".

Here are the latest member reviews:
${reviews.map(r => `- ${r}`).join("\n")}

Synthesize these reviews into a single paragraph (2-4 sentences) that captures 
the vibe, the highlights, and the consensus of the Sunday Brunch Club. 
Be witty and focused on the breakfast sandwich experience.
    `.trim();

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Error generating sandwich description:", error);
        return "";
    }
}
