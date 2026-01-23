import Hero from "@/components/Hero";
import SandwichCard from "@/components/SandwichCard";
import { db } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

async function getFeaturedSandwiches() {
  const sandwichesSnap = await db.collection("sandwiches")
    .orderBy("averageRating", "desc")
    .limit(4)
    .get();

  const restaurantsSnap = await db.collection("restaurants").get();
  const restaurantsMap = Object.fromEntries(
    restaurantsSnap.docs.map(doc => [doc.id, doc.data().name])
  );

  return sandwichesSnap.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    restaurantName: restaurantsMap[doc.data().restaurantId] || "Unknown",
  })) as any[];
}

export default async function Home() {
  const sandwiches = await getFeaturedSandwiches();

  return (
    <div className="space-y-12 pb-20">
      <Hero />

      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-breakfast-coffee">Top Rated Sammies</h2>
            <p className="text-muted-foreground">The cream of the crop, as voted by our club.</p>
          </div>
          <button className="text-primary font-bold text-sm hover:underline">View All</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sandwiches.map((sandwich) => (
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
      </section>

      <section className="bg-breakfast-egg/30 rounded-3xl p-8 border border-border">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-breakfast-coffee mb-4">What is BrekkySammy?</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            We're just a group of friends who take breakfast seriously. Every few weeks, we hit a new spot,
            order their signature sandwich, and give it an honest (and sometimes brutal) rating.
            This app helps us track our findings and discover the best morning fuel in Chicago.
          </p>
          <div className="flex gap-4">
            <div className="flex -space-x-3 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground flex items-center">
              Joined by <span className="font-bold text-breakfast-coffee mx-1">12+</span> brunch enthusiasts
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
