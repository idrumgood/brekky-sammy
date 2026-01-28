import Hero from "@/components/Hero";
import SandwichCard from "@/components/SandwichCard";
import { db } from "@/lib/firebase-admin";
import Link from "next/link";
import { sanitize } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const [sandwichesSnap, restaurantsSnap, usersSnap] = await Promise.all([
    db.collection("sandwiches").orderBy("lastReviewedAt", "desc").limit(4).get(),
    db.collection("restaurants").get(),
    db.collection("users").limit(10).get() // Get a few users for the avatar display
  ]);

  const totalUsersSnap = await db.collection("users").count().get();
  const totalUsers = totalUsersSnap.data().count;

  const restaurantsMap = Object.fromEntries(
    restaurantsSnap.docs.map(doc => [doc.id, doc.data().name])
  );

  const sandwiches = sandwichesSnap.docs.map(doc => sanitize({
    id: doc.id,
    ...doc.data(),
    restaurantName: restaurantsMap[doc.data().restaurantId] || "Unknown",
  })) as any[];

  const featuredUsers = usersSnap.docs
    .map(doc => ({
      uid: doc.id,
      displayName: doc.data().displayName || "Sammy Scout",
      photoURL: doc.data().photoURL || null,
    }))
    .filter(u => u.photoURL) // Prioritize users with photos
    .slice(0, 4);

  // If not enough users with photos, fill with others
  if (featuredUsers.length < 4) {
    const others = usersSnap.docs
      .map(doc => ({
        uid: doc.id,
        displayName: doc.data().displayName || "Sammy Scout",
        photoURL: doc.data().photoURL || null,
      }))
      .filter(u => !featuredUsers.find(fu => fu.uid === u.uid))
      .slice(0, 4 - featuredUsers.length);
    featuredUsers.push(...others);
  }

  return { sandwiches, totalUsers, featuredUsers };
}

export default async function Home() {
  const { sandwiches, totalUsers, featuredUsers } = await getHomeData();

  return (
    <div className="space-y-12 pb-20">
      <Hero />

      <section>
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-breakfast-coffee">Recently Reviewed Sammys</h2>
            <p className="text-muted-foreground">The latest morning fuel the club has tried.</p>
          </div>
          <Link href="/search" className="text-primary font-bold text-sm hover:underline">
            View All
          </Link>
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
            We&apos;re just a group of friends who take breakfast seriously. Every few weeks, we hit a new spot,
            order their signature sandwich, and give it an honest (and sometimes brutal) rating.
            This app helps us track our findings and discover the best morning fuel in Chicago.
          </p>
          <div className="flex gap-4">
            <div className="flex -space-x-3 overflow-hidden">
              {featuredUsers.map((user) => (
                user.photoURL ? (
                  <img
                    key={user.uid}
                    src={user.photoURL}
                    alt={user.displayName}
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover"
                  />
                ) : (
                  <div key={user.uid} className="inline-block h-10 w-10 rounded-full ring-2 ring-white bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )
              ))}
            </div>
            <p className="text-sm text-muted-foreground flex items-center">
              Joined by <span className="font-bold text-breakfast-coffee mx-1">{totalUsers}</span> brunch enthusiasts
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
