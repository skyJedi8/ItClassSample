import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';
import { serviceAreas } from '@/lib/areas';

const staticPaths = [
  '',
  '/services',
  '/services/gutter-cleaning',
  '/services/window-cleaning',
  '/services/pressure-washing',
  '/services/roof-cleaning',
  '/services/drainage-cleaning',
  '/service-areas',
  '/commercial-hoa',
  '/about',
  '/gallery',
  '/reviews',
  '/contact',
  '/faq',
  '/privacy'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const areaPaths = serviceAreas.map((area) => '/service-areas/' + area.slug);
  return [...staticPaths, ...areaPaths].map((path) => ({
    url: siteConfig.baseUrl + path,
    lastModified: new Date()
  }));
}
