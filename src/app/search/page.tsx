import SandwichCard from "@/components/SandwichCard";
import { db } from "@/lib/firebase-admin";
import { Search as SearchIcon } from 'lucide-react';

async function searchSandwiches(query: string) {
    // Fetch all sandwiches and restaurants for in-memory search (since dataset is small)
    const sandwichesSnap = await db.collection("sandwiches").get();
    const restaurantsSnap = await db.collection("restaurants").get();

    const restaurantsMap = Object.fromEntries(
        restaurantsSnap.docs.map(doc => [doc.id, doc.data().name])
    );

    const allSandwiches = sandwichesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        restaurantName: restaurantsMap[doc.data().restaurantId] || "Unknown",
    })) as any[];

    if (!query) return allSandwiches;

    const lowerQuery = query.toLowerCase();

    return allSandwiches.filter(s => {
        const nameMatch = s.name.toLowerCase().includes(lowerQuery);
        const restaurantMatch = s.restaurantName.toLowerCase().includes(lowerQuery);
        const ingredientMatch = (s.ingredients || []).some((ing: string) => ing.toLowerCase().includes(lowerQuery));

        return nameMatch || restaurantMatch || ingredientMatch;
    });
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const results = await searchSandwiches(q || "");

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-breakfast-coffee">
                        {q ? `Results for "${q}"` : "All Sandwiches"}
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
                        Try searching for something else, like "bacon", "allez", or "muffin".
                    </p>
                </div>
            )}
        </div>
    );
}
