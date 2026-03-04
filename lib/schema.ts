import { siteConfig } from './site';

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: siteConfig.name,
  description: `${siteConfig.tagline} Veteran-owned exterior cleaning in Houston and surrounding areas.`,
  areaServed: ['Houston', 'Katy', 'Sugar Land', 'Spring', 'The Woodlands'],
  telephone: siteConfig.phoneDisplay,
  email: siteConfig.email,
  url: siteConfig.baseUrl,
  openingHours: 'Mo-Su 08:00-17:00',
  priceRange: '$$'
};

export function serviceSchema(name: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: name,
    provider: { '@type': 'LocalBusiness', name: siteConfig.name },
    areaServed: 'Greater Houston Metro',
    description,
    url: `${siteConfig.baseUrl}${path}`
  };
}
