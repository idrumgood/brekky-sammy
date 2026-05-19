import SandwichListView from "@/components/SandwichListView";
import { db } from "@/lib/firebase-admin";
import { sanitize } from "@/lib/utils";
import { sanitizeText } from "@/lib/sanitization";

export const dynamic = "force-dynamic";

async function getAllSandwiches() {
    // Fetch all sandwiches and restaurants for client-side filtering/sorting
    const [sandwichesSnap, restaurantsSnap] = await Promise.all([
        db.collection("sandwiches").get(),
        db.collection("restaurants").get()
    ]);

    const restaurantsMap = Object.fromEntries(
        restaurantsSnap.docs.map(doc => [doc.id, doc.data().name])
    );

    return sandwichesSnap.docs.map(doc => {
        const data = doc.data();
        return sanitize({
            id: doc.id,
            name: data.name,
            restaurantId: data.restaurantId,
            restaurantName: restaurantsMap[data.restaurantId] || "Unknown",
            averageRating: data.averageRating || 0,
            reviewCount: data.reviewCount || 0,
            ingredients: data.ingredients || [],
            imageUrl: data.imageUrl,
            createdAt: data.createdAt,
            ...data
        });
    });
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const { q } = await searchParams;
    const sanitizedQ = q ? sanitizeText(q) : "";
    const allSandwiches = await getAllSandwiches();

    return (
        <div className="pb-20">
            <SandwichListView 
                initialSandwiches={allSandwiches} 
                initialQuery={sanitizedQ} 
            />
        </div>
    );
}
