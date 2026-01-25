import SandwichCard from "@/components/SandwichCard";
import { db } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

import { Search as SearchIcon } from 'lucide-react';

interface SandwichResult {
    id: string;
    name: string;
    restaurantId: string;
    restaurantName: string;
    averageRating: number;
    reviewCount: number;
    ingredients?: string[];
    imageUrl?: string;
}

async function searchSandwiches(query: string): Promise<SandwichResult[]> {
    // Fetch all sandwiches and restaurants for in-memory search (since dataset is small)
    const sandwichesSnap = await db.collection("sandwiches").get();
    const restaurantsSnap = await db.collection("restaurants").get();

    const restaurantsMap = Object.fromEntries(
        restaurantsSnap.docs.map(doc => [doc.id, doc.data().name])
    );

    const allSandwiches = sandwichesSnap.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            restaurantId: data.restaurantId,
            restaurantName: restaurantsMap[data.restaurantId] || "Unknown",
            averageRating: data.averageRating || 0,
            reviewCount: data.reviewCount || 0,
            ingredients: data.ingredients,
            imageUrl: data.imageUrl,
        };
    });

    if (!query) return allSandwiches;

    const lowerQuery = query.toLowerCase();

    return allSandwiches.filter(s => {
        const nameMatch = s.name.toLowerCase().includes(lowerQuery);
        const restaurantMatch = s.restaurantName.toLowerCase().includes(lowerQuery);
        const ingredientMatch = (s.ingredients || []).some((ing: string) => ing.toLowerCase().includes(lowerQuery));

        return nameMatch || restaurantMatch || ingredientMatch;
    });
}

import { sanitizeText } from "@/lib/sanitization";

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const sanitizedQ = q ? sanitizeText(q) : "";
    const results = await searchSandwiches(sanitizedQ);

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-breakfast-coffee">
                        {sanitizedQ ? `Results for "${sanitizedQ}"` : "All Sandwiches"}
                    </h1>
                    <p className="text-muted-foreground">
                        Found {results.length} {results.length === 1 ? 'sandwich' : 'sandwiches'} matching your search.
                    </p>
                </div>
            </div>

            {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {results.map((sandwich) => (
                        <SandwichCard
                            key={sandwich.id}
                            id={sandwich.id}
                            name={sandwich.name}
                            restaurantName={sandwich.restaurantName}
                            averageRating={sandwich.averageRating}
                            reviewCount={sandwich.reviewCount}
                            ingredients={sandwich.ingredients}
                            imageUrl={sandwich.imageUrl}
                        />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center bg-secondary/20 rounded-3xl border-2 border-dashed border-border">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-muted-foreground">
                        <SearchIcon size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-breakfast-coffee mb-2">No sandwiches found</h2>
                    <p className="text-muted-foreground max-w-xs mx-auto">
                        Try searching for something else, like &quot;bacon&quot;, &quot;allez&quot;, or &quot;muffin&quot;.
                    </p>
                </div>
            )}
        </div>
    );
}
