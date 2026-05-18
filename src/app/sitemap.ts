export const dynamic = 'force-dynamic';
import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase-admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://brekkysammy.com';

  // Fetch all sandwiches
  const sandwichesSnap = await db.collection("sandwiches").get();

  const sandwichUrls: MetadataRoute.Sitemap = sandwichesSnap.docs.map((doc) => ({
    url: `${baseUrl}/sandwich/${doc.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...sandwichUrls,
  ];
}
