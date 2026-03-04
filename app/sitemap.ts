import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.contexcorp.com';
  return [
    { url: `${base}/`,           lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/#pricing`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/#solutions`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/#cases`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/#contact`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/privacy`,    lastModified: new Date(), changeFrequency: 'yearly',  priority: 0.4 },
  ];
}
