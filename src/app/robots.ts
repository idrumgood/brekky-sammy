import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/search', '/sandwich/*', '/about', '/map'],
      disallow: ['/admin', '/profile', '/submit', '/login', '/users/*'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://brekkysammy.com'}/sitemap.xml`,
  };
}
