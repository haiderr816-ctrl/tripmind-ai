import { MetadataRoute } from 'next';

const destinations = ['dubai', 'paris', 'tokyo', 'bali', 'london', 'new-york'];
const blogPosts = [
  'best-time-to-visit-dubai',
  'paris-travel-guide',
  'tokyo-on-a-budget',
  'bali-itinerary-7-days',
  'london-hidden-gems',
  'new-york-first-time',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tripmind-ai-kappa.vercel.app';
  
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${baseUrl}/explore`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/itineraries`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
  ];

  const destinationPages = destinations.map((slug) => ({
    url: `${baseUrl}/destinations/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const blogPages = blogPosts.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...destinationPages, ...blogPages];
}